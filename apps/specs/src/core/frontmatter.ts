import { load } from 'js-yaml';

export interface Frontmatter {
  data: Record<string, unknown>;
  content: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Split a `---` YAML block off the top of a markdown file.
 *
 * The Nuxt version used gray-matter, which pulls in Buffer and does not run in a
 * browser bundle. Since parsing happens client-side now, this hands the block to
 * js-yaml directly — same YAML support, no Node built-ins.
 */
export function parseFrontmatter(raw: string): Frontmatter {
  const match = raw.match(FENCE);
  if (!match?.[1]) return { data: {}, content: raw };

  let data: Record<string, unknown> = {};
  try {
    const parsed = load(match[1]);
    if (parsed && typeof parsed === 'object') data = parsed as Record<string, unknown>;
  } catch {
    // A malformed block should not blank the page — the body still renders, and
    // the spec just falls back to a title derived from its heading or filename.
    data = {};
  }

  return { data, content: raw.slice(match[0].length) };
}
