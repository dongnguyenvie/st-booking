import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomFillSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../@core/prisma/prisma.service';
import { IEmailService, EMAIL_SERVICE } from '../@core/email/email.service.interface';
import { TwoFactorMethod } from '@repo/core';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function generateSixDigitCode(): string {
  // Use crypto random for uniform distribution across 000000–999999
  const buf = Buffer.alloc(4);
  randomFillSync(buf);
  const num = buf.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(6, '0');
}

@Injectable()
export class EmailOtpHelper {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  /**
   * Create a TwoFactorChallenge row, send OTP email, return challengeId.
   * Caller provides the user's email for delivery.
   */
  async createChallenge(userId: string, email: string): Promise<string> {
    const code = generateSixDigitCode();
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const challenge = await this.prisma.twoFactorChallenge.create({
      data: { userId, method: TwoFactorMethod.EMAIL, codeHash, expiresAt },
    });

    await this.emailService.sendOtp(email, code, OTP_EXPIRY_MINUTES);
    return challenge.id;
  }

  /**
   * Verify the latest unconsumed EMAIL challenge for userId.
   * Increments attempts, marks consumed on success.
   * Throws UnauthorizedException on any failure.
   */
  async verifyChallenge(userId: string, code: string): Promise<void> {
    const challenge = await this.prisma.twoFactorChallenge.findFirst({
      where: {
        userId,
        method: TwoFactorMethod.EMAIL,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      throw new UnauthorizedException('No valid email OTP challenge found');
    }

    if (challenge.attempts >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Too many failed attempts — request a new code');
    }

    // Increment attempts before compare to prevent race conditions
    await this.prisma.twoFactorChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });

    const hashMatch = timingSafeStringEqual(sha256(code), challenge.codeHash);
    if (!hashMatch) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    await this.prisma.twoFactorChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });
  }
}
