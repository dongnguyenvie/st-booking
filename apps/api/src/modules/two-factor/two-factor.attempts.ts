import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface AttemptRecord {
  count: number;
  resetAt: number; // epoch ms
}

/**
 * In-memory per-userId failure counter.
 * Resets automatically after WINDOW_MS.
 * NOTE: state is lost on process restart — acceptable for v1.
 */
@Injectable()
export class AttemptsTracker {
  private readonly map = new Map<string, AttemptRecord>();

  /** Returns true if the userId has exceeded the failure threshold. */
  isLocked(userId: string): boolean {
    const record = this.map.get(userId);
    if (!record) return false;
    if (Date.now() > record.resetAt) {
      this.map.delete(userId);
      return false;
    }
    return record.count >= MAX_FAILURES;
  }

  /**
   * Record a failed verification attempt.
   * Throws TooManyRequestsException when the threshold is reached.
   */
  recordFailure(userId: string): void {
    const now = Date.now();
    const existing = this.map.get(userId);

    if (!existing || now > existing.resetAt) {
      this.map.set(userId, { count: 1, resetAt: now + WINDOW_MS });
      return;
    }

    existing.count += 1;

    if (existing.count >= MAX_FAILURES) {
      throw new HttpException(
        'Too many failed verification attempts. Try again in 10 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /** Reset failure count on successful verification. */
  reset(userId: string): void {
    this.map.delete(userId);
  }

  /** Test-only: Reset all tracking. Guarded by NODE_ENV check. */
  __resetAll(): void {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('__resetAll is test-only');
    }
    this.map.clear();
  }
}
