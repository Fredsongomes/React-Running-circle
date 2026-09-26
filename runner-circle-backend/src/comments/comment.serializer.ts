import { ApiProperty } from '@nestjs/swagger';
import { AuthorSummary, toAuthorSummary } from '../users/user.serializer';
import { Comment } from './entities/comment.entity';

export class CommentResponse {
  @ApiProperty() id: string;
  @ApiProperty() postId: string;
  @ApiProperty({ type: AuthorSummary }) author: AuthorSummary;
  @ApiProperty() text: string;
  @ApiProperty() createdAt: Date;
}

export class PaginatedCommentsResponse {
  @ApiProperty({ type: [CommentResponse] }) data: CommentResponse[];
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 10 }) limit: number;
  @ApiProperty({ example: 4 }) total: number;
}

export function toCommentResponse(comment: Comment): CommentResponse {
  return {
    id: comment.id,
    postId: comment.postId,
    author: toAuthorSummary(comment.author),
    text: comment.text,
    createdAt: comment.createdAt,
  };
}
