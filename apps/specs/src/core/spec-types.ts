export interface SpecMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  updatedAt: string;
  /** Other spec slugs this one builds on — declared via `depends_on` frontmatter. */
  dependsOn: string[];
}

/** A spec with its raw markdown body — the unit search, memory and export consume. */
export interface SpecSource extends SpecMeta {
  content: string;
}

export interface Spec extends SpecMeta {
  html: string;
}
