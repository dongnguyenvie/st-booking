import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  log(message: string, context?: string) {
    if (this.isProduction()) return;
    super.log(message, context ?? this.context);
  }

  debug(message: string, context?: string) {
    if (this.isProduction()) return;
    super.debug(message, context ?? this.context);
  }

  verbose(message: string, context?: string) {
    if (this.isProduction()) return;
    super.verbose(message, context ?? this.context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context ?? this.context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context ?? this.context);
    // Extension point: send to Sentry/Slack here
  }

  private isProduction(): boolean {
    return (process.env.APP_ENV || process.env.NODE_ENV) === 'production';
  }
}
