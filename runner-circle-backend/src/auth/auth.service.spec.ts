import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const publicUser = { id: 'u1', username: 'julio', name: 'Júlio' };

  async function setup(storedPassword: string | null) {
    const users = {
      findByLoginWithPassword: jest.fn().mockResolvedValue(
        storedPassword === null
          ? null
          : {
              id: 'u1',
              username: 'julio',
              passwordHash: await bcrypt.hash(storedPassword, 4),
            },
      ),
      findMe: jest.fn().mockResolvedValue(publicUser),
    };
    const jwt = { signAsync: jest.fn().mockResolvedValue('jwt-token') };
    const service = new AuthService(
      users as unknown as UsersService,
      jwt as unknown as JwtService,
    );
    return { service, users, jwt };
  }

  it('devolve token e usuário quando a senha confere', async () => {
    const { service, jwt } = await setup('secret123');

    const result = await service.login('julio@example.com', 'secret123');

    expect(result).toEqual({ token: 'jwt-token', user: publicUser });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 'u1',
      username: 'julio',
    });
  });

  it('rejeita senha errada com 401', async () => {
    const { service, jwt } = await setup('secret123');

    await expect(
      service.login('julio@example.com', 'errada'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('rejeita usuário inexistente com a mesma mensagem (não revela se o login existe)', async () => {
    const { service } = await setup(null);

    await expect(service.login('ninguem', 'secret123')).rejects.toThrow(
      'Email ou senha inválidos',
    );
  });
});
