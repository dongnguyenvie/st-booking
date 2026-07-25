import { parseFrontmatter } from './frontmatter';
import type { SpecSource } from './spec-types';
import { mtimes } from 'virtual:spec-mtimes';

/**
 * The corpus, resolved at build time.
 *
 * `specs/` is still the single source of truth — drop a `.md` file in and it
 * appears. What changed from the Nuxt version is *when* that resolution happens:
 * Vite inlines every file into the bundle here, so there is no server to ask at
 * runtime and no API route in front of it.
 *
 * The cost is that adding a spec needs a rebuild rather than a refresh. In dev
 * that is what HMR already does, and for a spec hub the corpus is small enough
 * that shipping it whole is cheaper than the infrastructure to serve it.
 */
const files = import.meta.glob<string>('../../specs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function toSlugArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string').map((v) => v.trim());
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function deriveTitle(slug: string, data: Record<string, unknown>, content: string): string {
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim();
  const h1 = content.match(/^\s*#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].trim();
  const last = slug.split('/').pop() ?? slug;
  return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** `../../specs/marketplace/funding-room.md` -> `marketplace/funding-room` */
function toSlug(path: string): string {
  return path.replace(/^\.\.\/\.\.\/specs\//, '').replace(/\.md$/i, '');
}

function parseSpec(path: string, raw: string): SpecSource {
  const { data, content } = parseFrontmatter(raw);
  const slug = toSlug(path);

  return {
    slug,
    title: deriveTitle(slug, data, content),
    description: typeof data.description === 'string' ? data.description : '',
    order: typeof data.order === 'number' ? data.order : Number.POSITIVE_INFINITY,
    updatedAt: mtimes[`${slug}.md`] ?? '',
    dependsOn: toSlugArray(data.depends_on ?? data.dependsOn),
    content,
  };
}

/** Every spec, sorted by `order` then title — the order the sidebar and index use. */
export const corpus: SpecSource[] = Object.entries(files)
  .map(([path, raw]) => parseSpec(path, raw))
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export function findSpec(slug: string): SpecSource | undefined {
  return corpus.find((s) => s.slug === slug);
}
