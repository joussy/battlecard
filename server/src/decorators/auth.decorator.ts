import {
  AuthenticatedUser,
  BattlecardSessionRequest,
} from '@/interfaces/auth.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

/**
 * Custom decorator to extract the user id from the request object.
 * Usage: @User() user: AuthenticatedUser
 */
export const UserSession = createParamDecorator(
  (data: keyof AuthenticatedUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<BattlecardSessionRequest>();
    return data ? request?.session?.user?.[data] : request?.session?.user;
  },
);

export const IS_PUBLIC_KEY = 'isPublic';

export function NoAuthRequired() {
  return applyDecorators(SetMetadata(IS_PUBLIC_KEY, true), ApiSecurity({}, []));
}
