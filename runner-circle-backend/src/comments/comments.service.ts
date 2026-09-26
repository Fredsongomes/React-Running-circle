import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, PaginationQueryDto } from '../common/dto/pagination.dto';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentResponse, toCommentResponse } from './comment.serializer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
  ) {}

  async listByPost(
    postId: string,
    pagination: PaginationQueryDto,
  ): Promise<Paginated<CommentResponse>> {
    await this.ensurePostExists(postId);
    const { page, limit } = pagination;

    const [comments, total] = await this.comments.findAndCount({
      where: { postId },
      order: { createdAt: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: comments.map(toCommentResponse),
      page,
      limit,
      total,
    };
  }

  async create(
    postId: string,
    authorId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponse> {
    await this.ensurePostExists(postId);

    const comment = this.comments.create({
      postId,
      author: { id: authorId } as User,
      text: dto.text,
    });
    const saved = await this.comments.save(comment);

    // Recarrega para trazer o author embutido (relação eager).
    const full = await this.comments.findOne({ where: { id: saved.id } });
    return toCommentResponse(full ?? saved);
  }

  async remove(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<void> {
    const comment = await this.comments.findOne({
      where: { id: commentId, postId },
    });
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (comment.author.id !== userId) {
      throw new ForbiddenException('Só o autor pode excluir o comentário');
    }
    await this.comments.delete({ id: commentId });
  }

  private async ensurePostExists(postId: string): Promise<void> {
    const exists = await this.posts.exists({ where: { id: postId } });
    if (!exists) throw new NotFoundException('Post não encontrado');
  }
}
