import { ApiProperty } from '@nestjs/swagger';
import { resolveUrl } from '../uploads/uploads.util';
import { AuthorSummary, toAuthorSummary } from '../users/user.serializer';
import { Post } from './entities/post.entity';
import type { WorkoutType } from './entities/post.entity';

export class PostResponse {
  @ApiProperty() id: string;
  @ApiProperty({ type: AuthorSummary }) author: AuthorSummary;
  @ApiProperty({ nullable: true }) imageUrl: string | null;
  @ApiProperty() durationSeconds: number;
  @ApiProperty({ enum: ['walking', 'running'] }) type: WorkoutType;
  @ApiProperty({ description: 'metros' }) distanceMeters: number;
  @ApiProperty({ description: 'kcal' }) calories: number;
  @ApiProperty({ description: 'bpm' }) heartRateBpm: number;
  @ApiProperty() description: string;
  @ApiProperty() likesCount: number;
  @ApiProperty() likedByMe: boolean;
  @ApiProperty() commentsCount: number;
  @ApiProperty() createdAt: Date;
}

export function toPostResponse(
  post: Post,
  likedByMe: boolean,
  likesCount: number,
  commentsCount: number,
): PostResponse {
  return {
    id: post.id,
    author: toAuthorSummary(post.author),
    imageUrl: resolveUrl(post.imageUrl),
    durationSeconds: post.durationSeconds,
    type: post.type,
    distanceMeters: post.distanceMeters,
    calories: post.calories,
    heartRateBpm: post.heartRateBpm,
    description: post.description,
    likesCount,
    likedByMe,
    commentsCount,
    createdAt: post.createdAt,
  };
}

export class LikeToggleResponse {
  @ApiProperty() postId: string;
  @ApiProperty() likesCount: number;
  @ApiProperty() likedByMe: boolean;
}

export class PaginatedPostsResponse {
  @ApiProperty({ type: [PostResponse] }) data: PostResponse[];
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 10 }) limit: number;
  @ApiProperty({ example: 42 }) total: number;
}
