/**
 * Verifies the demo user this suite signs in as, by signing in.
 *
 * It seeds nothing — the API does that (`SEED_ON_START=true`, or
 * `pnpm --filter api prisma:seed`). A failure here means the API is not running
 * or has not been seeded, which is worth failing loudly on rather than letting
 * every test time out at the login form.
 *
 * The borrower is used because these tests only need an ordinary signed-in user
 * for /settings/security. Credentials must match SEED_USERS in
 * apps/api/src/modules/@core/seed/seed.service.ts.
 */

const TEST_USER_EMAIL = 'borrower@carousel-marketplace.dev';
const TEST_USER_PASSWORD = 'Borrower@2026!Secure';

export async function ensureTestUserExists(): Promise<void> {
  const signInQuery = `
    mutation SignIn($input: SignInInput!) {
      signIn(input: $input) {
        data {
          accessToken
        }
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:7001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: signInQuery,
        variables: {
          input: {
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
          },
        },
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('Failed to verify test user:', result.errors[0]?.message);
      throw new Error(`Test user verification failed: ${result.errors[0]?.message}`);
    } else {
      console.log('Test user verified:', TEST_USER_EMAIL);
    }
  } catch (err) {
    console.error('Failed to verify test user:', err);
    throw err;
  }
}

export function getTestUserCredentials() {
  return {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  };
}
