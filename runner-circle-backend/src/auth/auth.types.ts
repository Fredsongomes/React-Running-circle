/** Formato do `req.user` após validação do JWT. */
export interface AuthUser {
  id: string;
  username: string;
}

/** Payload assinado no JWT. */
export interface JwtPayload {
  sub: string;
  username: string;
}
