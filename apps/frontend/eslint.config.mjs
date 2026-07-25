import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      /**
       * Module boundary enforcement for 200-dev scale.
       * Prevents cross-module imports that cause circular dependencies.
       *
       * Rules:
       * - src/components/ must NOT import from src/modules/ (shared code must not depend on features)
       * - src/store/ must NOT import from src/modules/
       */
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              // Targets the feature dir specifically. A bare '**/modules/**'
              // also matched store/'s own './modules/<slice>' imports, so every
              // reducer registered in root-reducer.ts warned — noise that
              // trained readers to ignore a rule that does catch real leaks.
              group: ['@/modules/**'],
              message:
                'Shared code (components/, store/, core/) must not import from modules/. Move shared logic up to components/ or core/.',
            },
          ],
        },
      ],
    },
    // Only apply to shared directories, not to modules themselves
    files: ['src/components/**', 'src/store/**', 'src/core/**'],
  },
];
