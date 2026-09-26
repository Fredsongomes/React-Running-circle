import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Júlio Oliveira' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    example: 'julio@example.com',
    description:
      'Campo "Email ou usuário": pode ser um email OU um handle. ' +
      'Se for email, o `username` é gerado a partir dele; senão vira o próprio handle.',
  })
  @IsString()
  @IsNotEmpty({ message: 'informe um email ou nome de usuário' })
  login: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'a senha precisa de ao menos 6 caracteres' })
  password: string;
}
