import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

// Global exception filter — handles HTTP and GraphQL contexts
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // GraphQL context: let NestJS/Apollo handle error formatting natively
    if (host.getType<string>() === 'graphql') {
      if (exception instanceof Error && !(exception instanceof HttpException)) {
        this.logger.error('GraphQL error', exception.stack);
      }
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} — ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'object' ? (message as { message?: unknown }).message || message : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
