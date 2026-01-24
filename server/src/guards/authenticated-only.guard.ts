import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Express.Request>();
    // Express session authentication: check if user exists in session
    if (request.session && request.session.user) {
      return true;
    }
    throw new UnauthorizedException('User is not authenticated');
  }
}
