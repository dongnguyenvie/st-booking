import { corpus, findSpec } from './corpus';
import { chunkSpec, type Chunk } from './rag';

/** A resolved spec reference — a slug plus its human title, ready to link. */
export interface SpecLink {
  slug: string;
  title: string;
}

/**
 * What the retrieval layer "remembers" about one spec: its chunks and its place
 * in the dependency graph. This is the preview behind the Doc/Memory toggle — it
 * shows the corpus the way an AI consumes it, not the way a human reads it.
 */
export interface SpecMemory {
  slug: string;
  title: string;
  description: string;
  /** The retrieval units — one per `##`/`###` section. */
  chunks: Chunk[];
  /** Specs this one builds on (`depends_on`), resolved to titles. */
  dependsOn: SpecLink[];
  /** Specs that build on this one — the reverse of `depends_on`. */
  dependents: SpecLink[];
}

const titleOf = new Map(corpus.map((s) => [s.slug, s.title]));

function link(slug: string): SpecLink {
  return { slug, title: titleOf.get(slug) ?? slug };
}

export function specMemory(slug: string): SpecMemory | null {
  const self = findSpec(slug);
  if (!self) return null;

  return {
    slug: self.slug,
    title: self.title,
    description: self.description,
    chunks: chunkSpec(self.slug, self.title, self.content),
    dependsOn: self.dependsOn.map(link),
    dependents: corpus.filter((s) => s.dependsOn.includes(slug)).map((s) => link(s.slug)),
  };
}
