import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class QueryPostsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra posts de um autor (aba Posts do perfil)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'authorId inválido' })
  authorId?: string;

  @ApiPropertyOptional({
    enum: ['me'],
    description:
      'likedBy=me → posts que o usuário logado curtiu (aba Curtidas). Exige token.',
  })
  @IsOptional()
  @IsIn(['me'], { message: 'likedBy só aceita o valor "me"' })
  likedBy?: 'me';

  @ApiPropertyOptional({
    enum: ['me'],
    description:
      'createdBy=me → posts criados pelo usuário logado. Sem token, o filtro é ignorado.',
  })
  @IsOptional()
  @IsIn(['me'], { message: 'createdBy só aceita o valor "me"' })
  createdBy?: 'me';
}
