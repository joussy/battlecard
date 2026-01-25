import { IS_PUBLIC_KEY } from '@/decorators/auth.decorator';
import { SessionExpiredException } from '@/exceptions/session-expired.exception';
import { BattlecardSessionRequest } from '@/interfaces/auth.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';

/**
 * Guard to allow access only to authenticated users.
 * Checks for the presence of a user in the session.
 * Public routes (marked with @Public) are exempted from this check.
 */
@Injectable()
export class AuthenticatedOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If public, allow access
    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<BattlecardSessionRequest>();
    // Express session authentication: check if user exists in session
    if (request.session && request.session.user) {
      return true;
    }
    throw new SessionExpiredException();
  }
}
