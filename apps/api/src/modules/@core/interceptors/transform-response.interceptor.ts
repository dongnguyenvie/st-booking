import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

/**
 * Wraps HTTP responses in { data, statusCode, timestamp }.
 * Skips GraphQL contexts — Apollo handles GQL response format itself.
 */
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | T> {
    // Skip wrapping for GraphQL requests
    if (context.getType<string>() === 'graphql') {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
