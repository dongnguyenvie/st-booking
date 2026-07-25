import { Module } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { TwoFactorResolver } from './two-factor.resolver';
import { TotpHelper } from './two-factor.totp.helper';
import { EmailOtpHelper } from './two-factor.email.helper';
import { AttemptsTracker } from './two-factor.attempts';
import { TestHelperController } from './test-helper.controller';
import { configuration } from '@core/config/configuration';

/**
 * TwoFactorModule — exposes 2FA setup, verify, and disable mutations.
 * Exports TwoFactorService so AuthModule (phase 04) can inject it for login verification.
 * CoreModule (global) provides PrismaService and EMAIL_SERVICE token.
 * TestHelperController (dev-only) provides /__test__/last-otp endpoint for Playwright e2e tests.
 */
@Module({
  providers: [TwoFactorService, TwoFactorResolver, TotpHelper, EmailOtpHelper, AttemptsTracker],
  controllers: !configuration().env.isProduction ? [TestHelperController] : [],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
