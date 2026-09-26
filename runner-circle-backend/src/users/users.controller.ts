import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from '../uploads/uploads.service';
import { imageMulterOptions } from '../uploads/uploads.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from './user.serializer';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly uploads: UploadsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastro — devolve o PublicUser criado' })
  @ApiCreatedResponse({ type: PublicUser })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuário logado (a partir do token)' })
  @ApiOkResponse({ type: PublicUser })
  me(@CurrentUser() user: AuthUser) {
    return this.users.findMe(user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', imageMulterOptions))
  @ApiOperation({
    summary: 'Edita o perfil do usuário logado (avatar opcional)',
  })
  @ApiOkResponse({ type: PublicUser })
  async updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const filename = avatar ? await this.uploads.saveAsWebp(avatar) : undefined;
    return this.users.updateMe(user.id, dto, filename);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Perfil público por username' })
  @ApiOkResponse({ type: PublicUser })
  byUsername(@Param('username') username: string) {
    return this.users.findByUsername(username);
  }
}
