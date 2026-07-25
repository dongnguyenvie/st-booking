import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const here = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],

  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(base) {
    // Tailwind is added here rather than in a vite.config.ts, because
    // @storybook/react-vite owns the config for this app and merges this in.
    base.plugins = [...(base.plugins ?? []), tailwindcss()];

    // @repo/ui exports raw .tsx source, so Vite has to follow the symlinked
    // workspace package out of this app's root to transform it.
    base.resolve = {
      ...base.resolve,
      preserveSymlinks: false,
    };
    base.server = {
      ...base.server,
      fs: { allow: [join(here, '../../..')] },
    };

    return base;
  },
};

export default config;
