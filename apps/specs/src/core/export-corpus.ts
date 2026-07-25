import { corpus } from './corpus';

/**
 * Render the whole corpus as a single markdown document. This is the "feed the
 * entire spec tree to the AI" primitive that works with zero infra, and is the
 * exact text a future embedding indexer would chunk.
 *
 * The Nuxt version served this from `/api/export`. With the corpus in the
 * bundle it is a pure string build, so the browser can produce the file itself.
 */
export function exportCorpus(): string {
  const out: string[] = [`# Spec Corpus (${corpus.length} spec${corpus.length === 1 ? '' : 's'})`, ''];

  for (const s of corpus) {
    out.push(`## ${s.title}`);
    const deps = s.dependsOn.length ? ` · depends on: ${s.dependsOn.map((d) => `\`${d}\``).join(', ')}` : '';
    out.push(`> slug: \`${s.slug}\`${deps}`);
    if (s.description) out.push('', `_${s.description}_`);
    out.push('', s.content.trim(), '', '---', '');
  }

  return out.join('\n');
}

/** Hand the corpus to the browser as a downloadable `.md` file. */
export function downloadCorpus(filename = 'spec-corpus.md'): void {
  const blob = new Blob([exportCorpus()], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
