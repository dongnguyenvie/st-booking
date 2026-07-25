/**
 * Two-factor authentication method.
 * Stored as string in DB (schema.prisma uses `String` with @FieldType override)
 * and exposed as GraphQL enum via prisma-nestjs-graphql.
 */
export enum TwoFactorMethod {
  TOTP = 'TOTP',
  EMAIL = 'EMAIL',
}
