import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EMAIL_SERVICE } from './email.service.interface';

/**
 * EmailModule — provides IEmailService under the EMAIL_SERVICE token.
 * Currently bound to ConsoleEmailService (dev stub).
 * Swap useClass to a real provider (SendGrid, SES) for production.
 */
@Global()
@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: EmailService,
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}
