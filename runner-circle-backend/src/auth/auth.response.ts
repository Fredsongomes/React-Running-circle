import { ApiProperty } from '@nestjs/swagger';
import { PublicUser } from '../users/user.serializer';

export class LoginResponse {
  @ApiProperty({ description: 'JWT bearer' }) token: string;
  @ApiProperty({ type: PublicUser }) user: PublicUser;
}
