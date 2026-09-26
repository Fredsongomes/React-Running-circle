import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Autenticação opcional: se houver token válido, popula `req.user`;
 * sem token (ou inválido), segue como anônimo (não lança 401).
 * Usado no feed e na listagem de comentários.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Não lança quando não há usuário — apenas devolve undefined.
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return user || (undefined as unknown as TUser);
  }
}
