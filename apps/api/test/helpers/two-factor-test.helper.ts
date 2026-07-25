import { authenticator } from 'otplib';
import request from 'supertest';

/**
 * Compute a valid TOTP code from a base32 secret.
 * Uses the same otplib library as the service, so window drift is handled.
 */
export function computeTotp(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Execute a GraphQL mutation via supertest.
 */
export async function graphqlMutation(app: any, mutation: string, variables?: any, token?: string) {
  const req = request(app.getHttpServer()).post('/graphql').send({
    query: mutation,
    variables,
  });

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  const res = await req;
  if (res.body.errors) {
    const err = res.body.errors[0];
    throw new Error(`GraphQL error: ${err.message}`);
  }
  return res.body.data;
}

/**
 * Execute a GraphQL query via supertest.
 */
export async function graphqlQuery(app: any, query: string, token: string) {
  const res = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({ query });

  if (res.body.errors) {
    const err = res.body.errors[0];
    throw new Error(`GraphQL error: ${err.message}`);
  }
  return res.body.data;
}
