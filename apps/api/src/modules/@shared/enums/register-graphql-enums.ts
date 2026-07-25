import { registerEnumType } from '@nestjs/graphql';

import { Privilege, TwoFactorMethod } from '@repo/core';

// Register all enums used in GraphQL schema (code-first approach).
// Import this file once in AppModule to ensure enums are registered before schema generation.
registerEnumType(Privilege, {
  name: 'Privilege',
  description: 'Numeric privilege flags for access control',
});

registerEnumType(TwoFactorMethod, {
  name: 'TwoFactorMethod',
  description: 'Two-factor authentication method',
});
