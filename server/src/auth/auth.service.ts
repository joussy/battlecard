import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.signAsync(payload);
  }
}
