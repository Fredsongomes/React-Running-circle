import { ApiProperty } from '@nestjs/swagger';
import { resolveUrl } from '../uploads/uploads.util';
import { User } from './entities/user.entity';

/** Representação pública do usuário (nunca inclui passwordHash). */
export class PublicUser {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ example: 'julio', description: 'sem `@`' }) username: string;
  @ApiProperty({
    nullable: true,
    description: 'null se cadastrou só com usuário',
  })
  email: string | null;
  @ApiProperty({ nullable: true }) bio: string | null;
  @ApiProperty({ nullable: true }) avatarUrl: string | null;
  @ApiProperty({ description: 'nº de posts do usuário' }) workoutsCount: number;
  @ApiProperty() createdAt: Date;
}

/** Autor embutido em posts/comentários (subconjunto, sem email). */
export class AuthorSummary {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() username: string;
  @ApiProperty({ nullable: true }) avatarUrl: string | null;
}

export function toPublicUser(user: User, workoutsCount: number): PublicUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio ?? null,
    avatarUrl: resolveUrl(user.avatarUrl),
    workoutsCount,
    createdAt: user.createdAt,
  };
}

export function toAuthorSummary(user: User): AuthorSummary {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: resolveUrl(user.avatarUrl),
  };
}
