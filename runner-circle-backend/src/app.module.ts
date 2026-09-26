import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { buildDataSourceOptions } from './config/typeorm.config';
import { HealthController } from './health.controller';
import { PostsModule } from './posts/posts.module';
import { UPLOADS_DIR } from './uploads/uploads.util';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => buildDataSourceOptions(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), UPLOADS_DIR),
      serveRoot: `/${UPLOADS_DIR}`,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
