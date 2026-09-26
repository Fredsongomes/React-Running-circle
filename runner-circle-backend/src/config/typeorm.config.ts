import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../posts/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';

/**
 * Opções compartilhadas entre o runtime do Nest (TypeOrmModule.forRootAsync)
 * e o CLI de migrations (config/data-source.ts). Fonte única de verdade.
 */
export function buildDataSourceOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Post, Like, Comment],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
  };
}
