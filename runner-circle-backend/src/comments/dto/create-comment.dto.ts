import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bora treinar junto semana que vem?' })
  @IsString()
  @IsNotEmpty({ message: 'comentário não pode ser vazio' })
  @MaxLength(1000)
  text: string;
}
