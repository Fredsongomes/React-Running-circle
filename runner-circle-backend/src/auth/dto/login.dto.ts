import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'julio@example.com',
    description: 'Campo "Email ou usuário": casa com o email OU o username.',
  })
  @IsString()
  @IsNotEmpty({ message: 'informe seu email ou usuário' })
  login: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @IsNotEmpty({ message: 'senha obrigatória' })
  password: string;
}
