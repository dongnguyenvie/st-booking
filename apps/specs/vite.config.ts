import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const specsDir = fileURLToPath(new URL('./specs', import.meta.url));

const MTIMES_ID = 'virtual:spec-mtimes';
const RESOLVED_MTIMES_ID = `\0${MTIMES_ID}`;

/** Every `.md` under specsDir, keyed by its posix path relative to specsDir. */
function collectMtimes(dir: string, out: Record<string, string> = {}): Record<string, string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectMtimes(full, out);
    else if (entry.name.toLowerCase().endsWith('.md')) {
      out[relative(specsDir, full).split(sep).join('/')] = statSync(full).mtime.toISOString();
    }
  }
  return out;
}

/**
 * Exposes each spec's last-modified time as a virtual module.
 *
 * `import.meta.glob` gives content but no filesystem metadata, and this app has
 * no server to ask at runtime — so timestamps are baked in at build time.
 *
 * Caveat inherited from the Nuxt version this replaced: on a fresh clone every
 * file carries the checkout time, so "Updated" reads as today until the file is
 * next edited.
 */
function specMtimes(): Plugin {
  return {
    name: 'spec-mtimes',

    resolveId(id) {
      return id === MTIMES_ID ? RESOLVED_MTIMES_ID : undefined;
    },

    load(id) {
      if (id !== RESOLVED_MTIMES_ID) return undefined;
      return `export const mtimes = ${JSON.stringify(collectMtimes(specsDir), null, 2)};`;
    },

    /** Without this the baked-in timestamps would go stale mid dev session. */
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(specsDir) || !file.endsWith('.md')) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED_MTIMES_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), specMtimes()],
  server: { port: 3002 },
  preview: { port: 3002 },
  build: { outDir: 'dist' },
});
