import { UnauthorizedException } from '@nestjs/common';

export class SessionExpiredException extends UnauthorizedException {
  constructor() {
    super('Session expired');
  }
}
