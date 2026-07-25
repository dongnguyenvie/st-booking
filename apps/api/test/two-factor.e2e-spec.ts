import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/@core/prisma/prisma.service';
import { TestEmailService } from './helpers/test-email.service';
import { computeTotp, graphqlMutation, graphqlQuery } from './helpers/two-factor-test.helper';
import { EMAIL_SERVICE } from '../src/modules/@core/email/email.service.interface';
import { AttemptsTracker } from '../src/modules/two-factor/two-factor.attempts';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;
const TEST_PASSWORD = 'Test1234!';

describe('2FA E2E Functional Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let emailService: TestEmailService;
  let attemptsTracker: AttemptsTracker;
  let testUserIds: string[] = [];

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // Set required env vars for encryption if not already set
    if (!process.env.APP_ENCRYPTION_KEY) {
      // Create a proper 32-byte key encoded in base64
      const key = Buffer.alloc(32, 'test-encryption-key-32bytes');
      process.env.APP_ENCRYPTION_KEY = key.toString('base64');
    }
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
    }
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL =
        process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/canmorestays_test';
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_SERVICE)
      .useClass(TestEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    emailService = moduleFixture.get<TestEmailService>(EMAIL_SERVICE);
    attemptsTracker = moduleFixture.get<AttemptsTracker>(AttemptsTracker);
  }, 30000);

  afterAll(async () => {
    // Clean up test users
    await Promise.all(testUserIds.map((id) => prisma.user.deleteMany({ where: { id } }).catch(() => null)));
    if (app) await app.close();
  });

  beforeEach(async () => {
    emailService.resetAll();
    attemptsTracker.__resetAll();
  });

  // Helper: Create a test user
  async function createTestUser(email: string) {
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `Test User ${Date.now()}`,
        isActive: true,
        twoFactorEnabled: false,
        privileges: [1], // POS_USER
      },
    });
    testUserIds.push(user.id);
    return user;
  }

  // Helper: Sign in a user
  async function signIn(email: string, password: string) {
    const result = await graphqlMutation(
      app,
      `mutation signIn($input: SignInInput!) {
        signIn(input: $input) {
          data {
            accessToken
            twoFactorRequired
            preAuthToken
            twoFactorMethod
            user {
              id
              email
              twoFactorEnabled
              twoFactorMethod
            }
          }
        }
      }`,
      { input: { email, password } },
    );
    return result.signIn.data;
  }

  describe('Test 1: TOTP Setup Happy Path', () => {
    it('should initialize TOTP setup and return secret + QR code', async () => {
      const email = `totp-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      // Sign in to get access token
      const signInResult = await signIn(email, TEST_PASSWORD);
      expect(signInResult.twoFactorRequired).toBe(false);
      expect(signInResult.accessToken).toBeDefined();

      // Initialize TOTP setup
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
            qrCodeDataUrl
            challengeId
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      expect(setupInitResult.twoFactorSetupInit.secret).toBeDefined();
      expect(setupInitResult.twoFactorSetupInit.secret).toMatch(/^[A-Z2-7]+$/); // Base32 secret
      expect(setupInitResult.twoFactorSetupInit.qrCodeDataUrl).toMatch(/^data:image\/png/);
      expect(setupInitResult.twoFactorSetupInit.challengeId).toBeNull();

      // Compute valid TOTP code
      const totpCode = computeTotp(setupInitResult.twoFactorSetupInit.secret);

      // Verify setup
      const setupVerifyResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      expect(setupVerifyResult.twoFactorSetupVerify.success).toBe(true);

      // Verify DB state
      const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      expect(dbUser.twoFactorEnabled).toBe(true);
      expect(dbUser.twoFactorMethod).toBe('TOTP');
      expect(dbUser.twoFactorSecret).toBeDefined();
      expect(dbUser.twoFactorEnabledAt).toBeDefined();
    });
  });

  describe('Test 2: EMAIL Setup Happy Path', () => {
    it('should initialize EMAIL setup and verify with captured code', async () => {
      const email = `email-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      const signInResult = await signIn(email, TEST_PASSWORD);
      expect(signInResult.accessToken).toBeDefined();

      // Initialize EMAIL setup
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
            qrCodeDataUrl
            challengeId
          }
        }`,
        { method: 'EMAIL' },
        signInResult.accessToken,
      );

      expect(setupInitResult.twoFactorSetupInit.challengeId).toBeDefined();
      expect(setupInitResult.twoFactorSetupInit.secret).toBeNull();
      expect(setupInitResult.twoFactorSetupInit.qrCodeDataUrl).toBeNull();

      // Get captured OTP code from test email service
      const capturedCode = emailService.getLastCode(email);
      expect(capturedCode).toBeDefined();
      expect(capturedCode).toMatch(/^\d{6}$/);

      // Verify setup with captured code
      const setupVerifyResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'EMAIL', code: capturedCode } },
        signInResult.accessToken,
      );

      expect(setupVerifyResult.twoFactorSetupVerify.success).toBe(true);

      // Verify DB state
      const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      expect(dbUser.twoFactorEnabled).toBe(true);
      expect(dbUser.twoFactorMethod).toBe('EMAIL');
      expect(dbUser.twoFactorSecret).toBeNull();
      expect(dbUser.twoFactorEnabledAt).toBeDefined();
    });
  });

  describe('Test 3: Login with TOTP Enabled Requires 2FA', () => {
    it('should return preAuthToken when 2FA is enabled and require verification', async () => {
      const email = `totp-login-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      // Setup TOTP
      let signInResult = await signIn(email, TEST_PASSWORD);
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
            qrCodeDataUrl
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      const totpSecret = setupInitResult.twoFactorSetupInit.secret;
      const totpCode = computeTotp(totpSecret);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      // Sign in again - should get preAuthToken instead of accessToken
      signInResult = await signIn(email, TEST_PASSWORD);
      expect(signInResult.twoFactorRequired).toBe(true);
      expect(signInResult.preAuthToken).toBeDefined();
      expect(signInResult.accessToken).toBeNull();
      expect(signInResult.twoFactorMethod).toBe('TOTP');

      // Verify 2FA with correct code
      const verifyResult = await graphqlMutation(
        app,
        `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
          verifyTwoFactor(input: $input) {
            data {
              accessToken
              user {
                id
                email
                twoFactorEnabled
              }
            }
          }
        }`,
        { input: { preAuthToken: signInResult.preAuthToken, code: totpCode } },
      );

      expect(verifyResult.verifyTwoFactor.data.accessToken).toBeDefined();
      expect(verifyResult.verifyTwoFactor.data.user.id).toBe(user.id);
      expect(verifyResult.verifyTwoFactor.data.user.twoFactorEnabled).toBe(true);
    });
  });

  describe('Test 4: Wrong Code Rejected', () => {
    it('should reject invalid TOTP code during verification', async () => {
      const email = `totp-wrong-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      const totpCode = computeTotp(setupInitResult.twoFactorSetupInit.secret);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      signInResult = await signIn(email, TEST_PASSWORD);
      const preAuthToken = signInResult.preAuthToken;

      // Attempt with wrong code
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
            verifyTwoFactor(input: $input) {
              data {
                accessToken
              }
            }
          }`,
          variables: { input: { preAuthToken, code: '000000' } },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/[Ii]nvalid|[Uu]nauthorized/);
    });
  });

  describe('Test 5: Lockout After 5 Failures', () => {
    it('should lock account after 5 failed verification attempts', async () => {
      const email = `lockout-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      const totpCode = computeTotp(setupInitResult.twoFactorSetupInit.secret);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      signInResult = await signIn(email, TEST_PASSWORD);
      const preAuthToken = signInResult.preAuthToken;

      // Try 5 times with wrong code
      for (let i = 0; i < 5; i++) {
        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
              verifyTwoFactor(input: $input) {
                data { accessToken }
              }
            }`,
            variables: { input: { preAuthToken, code: '000000' } },
          });

        expect(res.body.errors).toBeDefined();
      }

      // 6th attempt should be locked
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
            verifyTwoFactor(input: $input) {
              data { accessToken }
            }
          }`,
          variables: { input: { preAuthToken, code: '000000' } },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/[Tt]oo many|locked/i);
    });
  });

  describe('Test 6: Resend Email OTP', () => {
    it('should resend OTP and allow verification with new code', async () => {
      const email = `resend-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            challengeId
          }
        }`,
        { method: 'EMAIL' },
        signInResult.accessToken,
      );

      const firstCode = emailService.getLastCode(email);

      // Verify setup with first code
      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'EMAIL', code: firstCode } },
        signInResult.accessToken,
      );

      // Sign in to trigger 2FA
      signInResult = await signIn(email, TEST_PASSWORD);
      const preAuthToken = signInResult.preAuthToken;

      // Resend email
      const resendResult = await graphqlMutation(
        app,
        `mutation resendTwoFactorEmail($input: ResendTwoFactorEmailInput!) {
          resendTwoFactorEmail(input: $input) {
            sent
          }
        }`,
        { input: { preAuthToken } },
      );

      expect(resendResult.resendTwoFactorEmail.sent).toBe(true);

      // Get new code (most recent)
      const newCode = emailService.getLastCode(email);
      expect(newCode).toBeDefined();

      // Verify 2FA with new code
      const verifyResult = await graphqlMutation(
        app,
        `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
          verifyTwoFactor(input: $input) {
            data { accessToken }
          }
        }`,
        { input: { preAuthToken, code: newCode } },
      );

      expect(verifyResult.verifyTwoFactor.data.accessToken).toBeDefined();
    });
  });

  describe('Test 7: Disable TOTP Flow', () => {
    it('should disable TOTP 2FA with password + valid code', async () => {
      const email = `disable-totp-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      const totpSecret = setupInitResult.twoFactorSetupInit.secret;
      const totpCode = computeTotp(totpSecret);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      // Re-sign in to get fresh token (since 2FA is now enabled)
      signInResult = await signIn(email, TEST_PASSWORD);
      const preAuthToken = signInResult.preAuthToken;

      // Verify 2FA with TOTP to get real JWT
      const verifyResult = await graphqlMutation(
        app,
        `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
          verifyTwoFactor(input: $input) {
            data { accessToken }
          }
        }`,
        { input: { preAuthToken, code: totpCode } },
      );

      const accessToken = verifyResult.verifyTwoFactor.data.accessToken;

      // Disable 2FA
      const disableResult = await graphqlMutation(
        app,
        `mutation twoFactorDisable($input: TwoFactorDisableInput!) {
          twoFactorDisable(input: $input) {
            success
          }
        }`,
        { input: { password: TEST_PASSWORD, code: totpCode } },
        accessToken,
      );

      expect(disableResult.twoFactorDisable.success).toBe(true);

      // Verify DB state
      const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      expect(dbUser.twoFactorEnabled).toBe(false);
      expect(dbUser.twoFactorMethod).toBeNull();
      expect(dbUser.twoFactorSecret).toBeNull();
      expect(dbUser.twoFactorEnabledAt).toBeNull();

      // Next sign-in should not require 2FA
      const nextSignIn = await signIn(email, TEST_PASSWORD);
      expect(nextSignIn.twoFactorRequired).toBe(false);
      expect(nextSignIn.accessToken).toBeDefined();
    });
  });

  describe('Test 8: Disable EMAIL Flow', () => {
    it('should disable EMAIL 2FA with password only', async () => {
      const email = `disable-email-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            challengeId
          }
        }`,
        { method: 'EMAIL' },
        signInResult.accessToken,
      );

      const setupEmailCode = emailService.getLastCode(email);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'EMAIL', code: setupEmailCode } },
        signInResult.accessToken,
      );

      // Re-sign in for 2FA token (this will issue a NEW email OTP challenge)
      signInResult = await signIn(email, TEST_PASSWORD);
      const loginEmailCode = emailService.getLastCode(email); // Get the NEW code sent on signIn

      const verifyResult = await graphqlMutation(
        app,
        `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
          verifyTwoFactor(input: $input) {
            data { accessToken }
          }
        }`,
        { input: { preAuthToken: signInResult.preAuthToken, code: loginEmailCode } },
      );

      const accessToken = verifyResult.verifyTwoFactor.data.accessToken;

      // Disable with password only
      const disableResult = await graphqlMutation(
        app,
        `mutation twoFactorDisable($input: TwoFactorDisableInput!) {
          twoFactorDisable(input: $input) {
            success
          }
        }`,
        { input: { password: TEST_PASSWORD } },
        accessToken,
      );

      expect(disableResult.twoFactorDisable.success).toBe(true);

      // Verify DB state
      const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      expect(dbUser.twoFactorEnabled).toBe(false);
      expect(dbUser.twoFactorMethod).toBeNull();
    });
  });

  describe('Test 9: Me Query Returns 2FA State', () => {
    it('should return twoFactorEnabled=true for user with 2FA', async () => {
      const email = `me-with-2fa-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      let signInResult = await signIn(email, TEST_PASSWORD);
      const setupInitResult = await graphqlMutation(
        app,
        `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
          twoFactorSetupInit(method: $method) {
            secret
          }
        }`,
        { method: 'TOTP' },
        signInResult.accessToken,
      );

      const totpCode = computeTotp(setupInitResult.twoFactorSetupInit.secret);

      await graphqlMutation(
        app,
        `mutation twoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
          twoFactorSetupVerify(input: $input) {
            success
          }
        }`,
        { input: { method: 'TOTP', code: totpCode } },
        signInResult.accessToken,
      );

      signInResult = await signIn(email, TEST_PASSWORD);
      const verifyResult = await graphqlMutation(
        app,
        `mutation verifyTwoFactor($input: VerifyTwoFactorInput!) {
          verifyTwoFactor(input: $input) {
            data { accessToken }
          }
        }`,
        { input: { preAuthToken: signInResult.preAuthToken, code: totpCode } },
      );

      const accessToken = verifyResult.verifyTwoFactor.data.accessToken;

      // Query me
      const meResult = await graphqlQuery(
        app,
        `query {
          me {
            id
            email
            twoFactorEnabled
            twoFactorMethod
          }
        }`,
        accessToken,
      );

      expect(meResult.me.twoFactorEnabled).toBe(true);
      expect(meResult.me.twoFactorMethod).toBe('TOTP');
    });

    it('should return twoFactorEnabled=false for user without 2FA', async () => {
      const email = `me-without-2fa-${Date.now()}@test.com`;
      const user = await createTestUser(email);

      const signInResult = await signIn(email, TEST_PASSWORD);
      const meResult = await graphqlQuery(
        app,
        `query {
          me {
            id
            email
            twoFactorEnabled
            twoFactorMethod
          }
        }`,
        signInResult.accessToken,
      );

      expect(meResult.me.twoFactorEnabled).toBe(false);
      expect(meResult.me.twoFactorMethod).toBeNull();
    });
  });

  describe('Test 10: Unauthenticated Access Blocked', () => {
    it('should reject twoFactorSetupInit without Authorization header', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation twoFactorSetupInit($method: TwoFactorMethod!) {
            twoFactorSetupInit(method: $method) {
              secret
            }
          }`,
          variables: { method: 'TOTP' },
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(/[Uu]nauthorized|[Aa]uthentication/);
    });
  });
});
