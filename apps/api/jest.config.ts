import { nestConfig } from '@repo/jest-config';

// Mirrors the `paths` in tsconfig.json. tsc and `nest build` resolve those via
// tsconfig, but jest has its own resolver — without this map any spec that pulls
// in a file importing '@core/...' fails with "Cannot find module".
// rootDir is 'src', so the targets are relative to src/.
export default {
  ...nestConfig,
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/modules/@core/$1',
    '^@jobs/(.*)$': '<rootDir>/modules/@jobs/$1',
    '^@auth/(.*)$': '<rootDir>/modules/auth/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@generated-dto/(.*)$': '<rootDir>/@generated-dto/$1',
  },
  // The preset collects coverage from '**/*.(t|j)s', which pulls in Prisma's
  // generated runtime. That bundle references a client.js.map it does not ship,
  // and the v8 coverage reporter hard-fails trying to read it.
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/modules/@core/prisma/generated/', '<rootDir>/@generated-dto/'],
};
