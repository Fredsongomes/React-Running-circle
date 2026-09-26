import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginResponse } from './auth.response';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(login: string, password: string): Promise<LoginResponse> {
    const user = await this.users.findByLoginWithPassword(login);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const token = await this.jwt.signAsync(payload);
    const publicUser = await this.users.findMe(user.id);
    return { token, user: publicUser };
  }
}
