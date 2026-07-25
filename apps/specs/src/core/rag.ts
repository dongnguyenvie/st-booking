import { corpus } from './corpus';

/**
 * The retrieval core. The unit of retrieval is a "chunk": one markdown section
 * (`##` heading) of a spec. That's the same granularity a LlamaIndex.TS
 * HierarchicalNodeParser would produce, so swapping in real embeddings later is a
 * drop-in — the chunk shape and `retrieve()` signature stay the same.
 */
export interface Chunk {
  slug: string;
  title: string;
  /** The `##`/`###` heading this chunk sits under ('' for the intro before any heading). */
  heading: string;
  text: string;
}

export interface RetrievedChunk extends Chunk {
  score: number;
}

/** Split one spec's markdown into per-heading chunks. */
export function chunkSpec(slug: string, title: string, content: string): Chunk[] {
  const chunks: Chunk[] = [];
  let heading = '';
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join('\n').trim();
    if (text) chunks.push({ slug, title, heading, text });
    buffer = [];
  };

  for (const line of content.split('\n')) {
    const m = line.match(/^#{2,3}\s+(.+?)\s*$/);
    if (m?.[1]) {
      flush();
      heading = m[1].replace(/[#`*_]/g, '').trim();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return chunks;
}

/**
 * The full index, built once at module load.
 *
 * The Nuxt version rebuilt this per request because the server had to re-read
 * the filesystem. The corpus is now a build-time constant, so it is computed
 * once and every search reuses it.
 */
export const index: Chunk[] = corpus.flatMap((s) => chunkSpec(s.slug, s.title, s.content));

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1);
}

/**
 * Score chunks against a query by term-overlap (a tiny TF measure). Zero infra,
 * good enough until the corpus outgrows the model's context window.
 *
 * SWAP POINT — when retrieval quality matters, replace this function body with an
 * embedding similarity search and keep this exact signature. Every caller stays
 * unchanged.
 */
export function retrieve(query: string, chunks: Chunk[] = index, topK = 6): RetrievedChunk[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  return chunks
    .map((c) => {
      const haystack = tokenize(`${c.title} ${c.heading} ${c.text}`);
      let score = 0;
      for (const term of terms) {
        for (const word of haystack) {
          if (word === term) score += 1;
          else if (word.includes(term)) score += 0.25;
        }
      }
      return { ...c, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
