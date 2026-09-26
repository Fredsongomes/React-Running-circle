import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type MockRepo<T extends object> = {
  [K in keyof Repository<T>]?: jest.Mock;
};

function setup() {
  const users: MockRepo<User> = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn((data: Partial<User>) => data),
    save: jest.fn((user: Partial<User>) =>
      Promise.resolve({ id: 'u1', createdAt: new Date(), ...user }),
    ),
  };
  const posts: MockRepo<Post> = {
    count: jest.fn().mockResolvedValue(0),
  };
  const service = new UsersService(
    users as unknown as Repository<User>,
    posts as unknown as Repository<Post>,
  );
  return { service, users, posts };
}

describe('UsersService', () => {
  describe('create', () => {
    it('cadastro por email: guarda o email em minúsculas e gera o username a partir dele', async () => {
      const { service, users } = setup();

      const result = await service.create({
        name: 'Júlio',
        login: 'Julio.Silva@Example.com',
        password: 'secret123',
      });

      expect(result.email).toBe('julio.silva@example.com');
      expect(result.username).toBe('julio.silva');
      expect(users.save).toHaveBeenCalled();
    });

    it('cadastro por email: adiciona sufixo numérico quando o username já existe', async () => {
      const { service, users } = setup();
      // 1ª busca: email livre; 2ª: "julio" ocupado; 3ª: "julio1" livre
      users
        .findOne!.mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'outro' })
        .mockResolvedValueOnce(null);

      const result = await service.create({
        name: 'Júlio',
        login: 'julio@example.com',
        password: 'secret123',
      });

      expect(result.username).toBe('julio1');
    });

    it('cadastro por handle: remove o @ e não guarda email', async () => {
      const { service } = setup();

      const result = await service.create({
        name: 'Júlio',
        login: '@julio_corrida',
        password: 'secret123',
      });

      expect(result.username).toBe('julio_corrida');
      expect(result.email).toBeNull();
    });

    it('rejeita handle inválido', async () => {
      const { service } = setup();

      await expect(
        service.create({
          name: 'X',
          login: 'com espaço',
          password: 'secret123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejeita email já cadastrado com 409', async () => {
      const { service, users } = setup();
      users.findOne!.mockResolvedValueOnce({ id: 'existente' });

      await expect(
        service.create({
          name: 'X',
          login: 'julio@example.com',
          password: 'secret123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('nunca salva a senha em texto puro', async () => {
      const { service, users } = setup();

      await service.create({
        name: 'X',
        login: 'julio@example.com',
        password: 'secret123',
      });

      const [[saved]] = users.save!.mock.calls as [[User]];
      expect(saved.passwordHash).not.toBe('secret123');
      await expect(
        bcrypt.compare('secret123', saved.passwordHash),
      ).resolves.toBe(true);
    });

    it('não expõe o hash da senha na resposta', async () => {
      const { service } = setup();

      const result = await service.create({
        name: 'X',
        login: 'julio@example.com',
        password: 'secret123',
      });

      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('updateMe', () => {
    it('rejeita username que já pertence a outro usuário', async () => {
      const { service, users } = setup();
      users
        .findOne!.mockResolvedValueOnce({ id: 'u1', username: 'julio' })
        .mockResolvedValueOnce({ id: 'u2', username: 'laura' });

      await expect(
        service.updateMe('u1', { username: 'laura' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
