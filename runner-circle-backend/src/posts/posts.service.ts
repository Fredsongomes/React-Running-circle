import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from '../common/dto/pagination.dto';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Like } from './entities/like.entity';
import { Post } from './entities/post.entity';
import {
  LikeToggleResponse,
  PostResponse,
  toPostResponse,
} from './post.serializer';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Like) private readonly likes: Repository<Like>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
  ) {}

  async findFeed(
    query: QueryPostsDto,
    currentUserId?: string,
  ): Promise<Paginated<PostResponse>> {
    const { page, limit, authorId, likedBy, createdBy } = query;

    const qb = this.posts
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC') // desempate estável p/ paginação consistente
      .skip((page - 1) * limit)
      .take(limit);

    if (authorId) {
      qb.andWhere('author.id = :authorId', { authorId });
    }
    // Anônimo pedindo createdBy=me não tem autor pra filtrar: ignora o filtro.
    if (createdBy === 'me' && currentUserId) {
      qb.andWhere('author.id = :currentAuthorId', {
        currentAuthorId: currentUserId,
      });
    }
    if (likedBy === 'me' && currentUserId) {
      // Subquery em vez de innerJoin: mantém a query com uma linha por post,
      // então ordenação/paginação ficam idênticas ao feed sem filtro.
      qb.andWhere(
        'post.id IN (SELECT l."postId" FROM likes l WHERE l."userId" = :uid)',
        { uid: currentUserId },
      );
    }

    const [posts, total] = await qb.getManyAndCount();
    const ids = posts.map((p) => p.id);
    const [likeCounts, commentCounts, likedSet] = await Promise.all([
      this.groupCount(this.likes, ids),
      this.groupCount(this.comments, ids),
      this.likedPostIds(currentUserId, ids),
    ]);

    return {
      data: posts.map((p) =>
        toPostResponse(
          p,
          likedSet.has(p.id),
          likeCounts.get(p.id) ?? 0,
          commentCounts.get(p.id) ?? 0,
        ),
      ),
      page,
      limit,
      total,
    };
  }

  async findOneResponse(
    id: string,
    currentUserId?: string,
  ): Promise<PostResponse> {
    const post = await this.posts.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');

    const [likeCounts, commentCounts, likedSet] = await Promise.all([
      this.groupCount(this.likes, [id]),
      this.groupCount(this.comments, [id]),
      this.likedPostIds(currentUserId, [id]),
    ]);

    return toPostResponse(
      post,
      likedSet.has(id),
      likeCounts.get(id) ?? 0,
      commentCounts.get(id) ?? 0,
    );
  }

  async create(
    authorId: string,
    dto: CreatePostDto,
    imageFilename?: string,
  ): Promise<PostResponse> {
    const post = this.posts.create({
      author: { id: authorId } as User,
      imageUrl: imageFilename ?? null,
      durationSeconds: dto.durationSeconds,
      type: dto.type,
      distanceMeters: dto.distanceMeters,
      calories: dto.calories,
      heartRateBpm: dto.heartRateBpm,
      description: dto.description,
    });
    const saved = await this.posts.save(post);
    return this.findOneResponse(saved.id, authorId);
  }

  async like(postId: string, userId: string): Promise<LikeToggleResponse> {
    await this.ensurePostExists(postId);
    // Idempotente: curtir de novo não duplica (ON CONFLICT DO NOTHING).
    await this.likes
      .createQueryBuilder()
      .insert()
      .values({ userId, postId })
      .orIgnore()
      .execute();
    return this.likeState(postId, userId);
  }

  async unlike(postId: string, userId: string): Promise<LikeToggleResponse> {
    await this.ensurePostExists(postId);
    await this.likes.delete({ postId, userId });
    return this.likeState(postId, userId);
  }

  private async ensurePostExists(postId: string): Promise<void> {
    const count = await this.posts.count({ where: { id: postId } });
    if (count === 0) throw new NotFoundException('Post não encontrado');
  }

  private async likeState(
    postId: string,
    userId: string,
  ): Promise<LikeToggleResponse> {
    const likesCount = await this.likes.count({ where: { postId } });
    const likedByMe =
      (await this.likes.count({ where: { postId, userId } })) > 0;
    return { postId, likesCount, likedByMe };
  }

  /** Contagem agrupada por postId (uma query), para likes ou comentários. */
  private async groupCount(
    repo: Repository<ObjectLiteral>,
    postIds: string[],
  ): Promise<Map<string, number>> {
    if (postIds.length === 0) return new Map();
    const rows = await repo
      .createQueryBuilder('t')
      .select('t.postId', 'postId')
      .addSelect('COUNT(*)', 'count')
      .where('t.postId IN (:...postIds)', { postIds })
      .groupBy('t.postId')
      .getRawMany<{ postId: string; count: string }>();
    return new Map(rows.map((r) => [r.postId, Number(r.count)]));
  }

  private async likedPostIds(
    userId: string | undefined,
    postIds: string[],
  ): Promise<Set<string>> {
    if (!userId || postIds.length === 0) return new Set();
    const likes = await this.likes.find({
      where: { userId, postId: In(postIds) },
    });
    return new Set(likes.map((l) => l.postId));
  }
}
