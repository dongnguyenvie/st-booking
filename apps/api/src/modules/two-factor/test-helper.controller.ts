import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { testOtpStore } from '../@core/email/email.service';

/**
 * Dev-only REST endpoint to retrieve the last OTP code sent to an email.
 * SECURITY: Only available in non-production environments (NODE_ENV !== 'production').
 * Throws 403 Forbidden if invoked in production.
 * Used by Playwright e2e tests to capture email OTP codes.
 */
@Controller('__test__')
export class TestHelperController {
  constructor() {
    // Fail fast in production - reject at instantiation time
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'TestHelperController is not available in production. ' +
          'This endpoint is for testing only and must never be exposed in production deployments.',
      );
    }
  }

  @Get('last-otp')
  getLastOtp(@Query('email') email: string) {
    if (!email) {
      throw new HttpException('Missing email query parameter', HttpStatus.BAD_REQUEST);
    }

    const entry = testOtpStore.get(email);
    if (!entry) {
      throw new HttpException(`No OTP found for ${email}`, HttpStatus.NOT_FOUND);
    }

    return { code: entry.code, email };
  }
}
