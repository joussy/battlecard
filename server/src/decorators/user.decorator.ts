import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the user id from the request object.
 * Usage: @User() user: AuthenticatedUser
 */
export const User = createParamDecorator(
  (data: keyof AuthenticatedUser, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    return data ? request.user?.[data] : request.user;
  },
);
