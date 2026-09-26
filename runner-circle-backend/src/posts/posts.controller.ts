import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { UploadsService } from '../uploads/uploads.service';
import { imageMulterOptions } from '../uploads/uploads.util';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import {
  LikeToggleResponse,
  PaginatedPostsResponse,
  PostResponse,
} from './post.serializer';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly posts: PostsService,
    private readonly uploads: UploadsService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Feed paginado. Filtros ?authorId, ?likedBy=me (exige token) e ?createdBy=me (ignorado se anônimo).',
  })
  @ApiOkResponse({ type: PaginatedPostsResponse })
  findFeed(@Query() query: QueryPostsDto, @CurrentUser() user?: AuthUser) {
    if (query.likedBy === 'me' && !user) {
      throw new UnauthorizedException(
        'É preciso estar autenticado para listar suas curtidas',
      );
    }
    return this.posts.findFeed(query, user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', imageMulterOptions))
  @ApiOperation({
    summary: 'Cria um post (foto opcional). Autor vem do token.',
  })
  @ApiCreatedResponse({ type: PostResponse })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePostDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const filename = image ? await this.uploads.saveAsWebp(image) : undefined;
    return this.posts.create(user.id, dto, filename);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post único' })
  @ApiOkResponse({ type: PostResponse })
  findOne(@Param('id') id: string, @CurrentUser() user?: AuthUser) {
    return this.posts.findOneResponse(id, user?.id);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Curte o post (idempotente)' })
  @ApiOkResponse({ type: LikeToggleResponse })
  like(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.posts.like(id, user.id);
  }

  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Descurte o post' })
  @ApiOkResponse({ type: LikeToggleResponse })
  unlike(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.posts.unlike(id, user.id);
  }
}
