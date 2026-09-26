import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Exige um Bearer token válido; sem token ou com token inválido → 401. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
