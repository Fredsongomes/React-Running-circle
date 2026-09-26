import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import type { WorkoutType } from '../entities/post.entity';

/**
 * Campos do POST /posts (multipart/form-data).
 * ⚠️ No multipart todo campo chega como string — `@Type(() => Number)` coage
 * os numéricos antes do `@IsInt()`, senão um post válido falharia com 400.
 * O front já envia em unidade canônica (metros/segundos/kcal/bpm).
 */
export class CreatePostDto {
  @ApiProperty({ example: 1800, description: 'segundos' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @ApiProperty({ enum: ['walking', 'running'], example: 'running' })
  @IsEnum(['walking', 'running'], {
    message: 'type deve ser walking ou running',
  })
  type: WorkoutType;

  @ApiProperty({ example: 5000, description: 'metros (front converte km→m)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  distanceMeters: number;

  @ApiProperty({ example: 300, description: 'kcal' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 120, description: 'bpm' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  heartRateBpm: number;

  @ApiProperty({ example: 'Hoje dei meu mínimo e esse foi meu máximo! kkkk' })
  @IsString()
  @IsNotEmpty({ message: 'descrição obrigatória' })
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Foto do treino (png/jpg/webp, até 15 MB, convertida para WebP)',
  })
  image?: unknown;
}
