import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { SessionExpiredException } from '@/exceptions/session-expired.exception';
import { Response } from 'express';

/**
 * Exception filter to handle SessionExpiredException globally.
 * Sets a custom header 'X-Session-Expired' in the response.
 */
@Catch(SessionExpiredException)
export class SessionExpiredFilter implements ExceptionFilter {
  catch(exception: SessionExpiredException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.set('X-Session-Expired', 'true').status(401).json({
      statusCode: 401,
      message: exception.message,
    });
  }
}
