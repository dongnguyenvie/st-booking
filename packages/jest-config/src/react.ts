import type { Config } from 'jest';
import { config as baseConfig } from './base';

/**
 * For plain React library packages — no Next.js, no Nest.
 *
 * `next/jest` (see ./next) pulls in a whole Next build pipeline to resolve app
 * aliases and CSS, which a package like @repo/email has no use for. This is the
 * same ts-jest transform the Nest preset uses, widened to tsx.
 */
export const reactConfig = {
  ...baseConfig,
  rootDir: 'src',
  testRegex: '.*\\.spec\\.tsx?$',
  moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'jsx', 'tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)sx?'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as const satisfies Config;
