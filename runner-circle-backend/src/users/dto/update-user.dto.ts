import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Júlio Oliveira' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({
    example: 'julio_corrida',
    description: 'Handle único, armazenado SEM `@`.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^@?[a-zA-Z0-9_.]{2,30}$/, {
    message:
      'username deve ter 2–30 caracteres (letras, números, _ ou .), sem espaços',
  })
  username?: string;

  @ApiPropertyOptional({ example: 'Corredor amador em evolução.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Novo avatar (png/jpg/webp, até 15 MB, convertido para WebP)',
  })
  avatar?: unknown;
}
