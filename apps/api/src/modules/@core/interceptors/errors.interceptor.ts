import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Catches unexpected (non-HTTP) errors and converts them to 500 responses.
 * In GraphQL context, lets Apollo handle errors natively (just logs them here).
 */
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        // In GraphQL context, rethrow — Apollo formats GQL errors itself
        if (context.getType<string>() === 'graphql') return throwError(() => err);
        if (err instanceof HttpException) return throwError(() => err);

        const message = err instanceof Error ? err.message : 'Unexpected error';
        const stack = err instanceof Error ? err.stack : undefined;
        this.logger.error(message, stack);

        return throwError(
          () =>
            new InternalServerErrorException(
              (process.env.APP_ENV || process.env.NODE_ENV) !== 'production'
                ? message
                : 'Internal server error',
            ),
        );
      }),
    );
  }
}
