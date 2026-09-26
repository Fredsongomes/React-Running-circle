import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { Not, Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PublicUser, toPublicUser } from './user.serializer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
  ) {}

  private normalizeUsername(username: string): string {
    return username.replace(/^@+/, '').trim();
  }

  private readonly USERNAME_RE = /^[a-zA-Z0-9_.]{2,30}$/;

  /** Gera um handle a partir da parte local de um email (slug). */
  private slugFromEmail(email: string): string {
    const local = email.split('@')[0].toLowerCase();
    const slug = local
      .replace(/[^a-z0-9_.]/g, '')
      .replace(/^[._]+|[._]+$/g, '');
    return slug.length >= 2 ? slug : `user${slug}`;
  }

  /** Garante unicidade do username, anexando sufixo numérico se preciso. */
  private async uniqueUsername(base: string): Promise<string> {
    let candidate = base.slice(0, 30);
    let n = 1;
    while (await this.users.findOne({ where: { username: candidate } })) {
      const suffix = String(n++);
      candidate = `${base.slice(0, 30 - suffix.length)}${suffix}`;
    }
    return candidate;
  }

  private async workoutsCount(userId: string): Promise<number> {
    return this.posts.count({ where: { author: { id: userId } } });
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const login = dto.login.trim();
    let email: string | null = null;
    let username: string;

    if (isEmail(login)) {
      // Caminho email: guarda o email e deriva um username único a partir dele.
      email = login.toLowerCase();
      if (await this.users.findOne({ where: { email } })) {
        throw new ConflictException('Esse usuário já existe');
      }
      username = await this.uniqueUsername(this.slugFromEmail(email));
    } else {
      // Caminho handle: o próprio login vira o username (sem `@`), sem email.
      username = this.normalizeUsername(login);
      if (!this.USERNAME_RE.test(username)) {
        throw new BadRequestException(
          'Usuário inválido: use um email válido ou um handle (2–30 caracteres, letras, números, _ ou .)',
        );
      }
      if (await this.users.findOne({ where: { username } })) {
        throw new ConflictException('Esse usuário já existe');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      name: dto.name,
      username,
      email,
      passwordHash,
      bio: null,
      avatarUrl: null,
    });
    const saved = await this.users.save(user);
    return toPublicUser(saved, 0);
  }

  async findMe(userId: string): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return toPublicUser(user, await this.workoutsCount(user.id));
  }

  async findByUsername(username: string): Promise<PublicUser> {
    const user = await this.users.findOne({
      where: { username: this.normalizeUsername(username) },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return toPublicUser(user, await this.workoutsCount(user.id));
  }

  async updateMe(
    userId: string,
    dto: UpdateUserDto,
    avatarFilename?: string,
  ): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.username !== undefined) {
      const username = this.normalizeUsername(dto.username);
      const clash = await this.users.findOne({
        where: { username, id: Not(userId) },
      });
      if (clash) throw new ConflictException('Nome de usuário já cadastrado');
      user.username = username;
    }
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (avatarFilename) user.avatarUrl = avatarFilename;

    const saved = await this.users.save(user);
    return toPublicUser(saved, await this.workoutsCount(saved.id));
  }

  /**
   * Uso interno da autenticação: acha o usuário pelo "Email ou usuário" e
   * carrega o hash (coluna select:false). `login` casa com email OU username.
   */
  async findByLoginWithPassword(login: string): Promise<User | null> {
    const value = login.trim();
    const username = this.normalizeUsername(value);
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email OR user.username = :username', {
        email: value.toLowerCase(),
        username,
      })
      .getOne();
  }

  async findEntityById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }
}
