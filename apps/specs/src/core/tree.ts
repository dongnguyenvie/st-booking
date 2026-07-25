import type { SpecMeta } from './spec-types';

/**
 * A node in the spec tree. Hierarchy comes from the slug path (folders), so the
 * filesystem stays the source of truth — no separate tree state to keep in sync.
 * A node is "backed" by a real file when `slug` is set; pure folders have `slug: null`.
 * A folder can be described by an `_index.md` inside it (its meta attaches to the folder).
 */
export interface SpecNode {
  name: string;
  slug: string | null;
  title: string;
  description: string;
  order: number;
  dependsOn: string[];
  children: SpecNode[];
}

const INF = Number.POSITIVE_INFINITY;

function titleFromName(name: string): string {
  return (
    name
      .replace(/^\d+[-_]?/, '') // drop ordering prefix like "01-"
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || name
  );
}

function emptyFolder(name: string): SpecNode {
  return { name, slug: null, title: titleFromName(name), description: '', order: INF, dependsOn: [], children: [] };
}

function findOrCreate(parent: SpecNode, name: string): SpecNode {
  let node = parent.children.find((c) => c.name === name);
  if (!node) {
    node = emptyFolder(name);
    parent.children.push(node);
  }
  return node;
}

/** Effective sort order: own order, else the smallest order among descendants. */
function effectiveOrder(node: SpecNode): number {
  if (Number.isFinite(node.order)) return node.order;
  return node.children.reduce((min, c) => Math.min(min, effectiveOrder(c)), INF);
}

function sortNode(node: SpecNode): void {
  node.children.sort((a, b) => {
    const oa = effectiveOrder(a);
    const ob = effectiveOrder(b);
    const da = Number.isFinite(oa) ? oa : 1e9;
    const db = Number.isFinite(ob) ? ob : 1e9;
    return da - db || a.title.localeCompare(b.title);
  });
  node.children.forEach(sortNode);
}

/** Build a nested tree from a flat, sorted list of spec metadata. */
export function buildTree(specs: SpecMeta[]): SpecNode[] {
  const root = emptyFolder('');
  for (const spec of specs) {
    // A slug always has at least one segment, but split() is not typed to say so.
    const segments = spec.slug.split('/').filter(Boolean);
    const last = segments.pop();
    if (!last) continue;

    let cursor = root;
    for (const segment of segments) {
      cursor = findOrCreate(cursor, segment);
    }
    // `_index.md` describes the folder it lives in rather than adding a child.
    const target = last === '_index' ? cursor : findOrCreate(cursor, last);
    target.slug = spec.slug;
    target.title = spec.title;
    target.description = spec.description;
    target.order = spec.order;
    target.dependsOn = spec.dependsOn;
  }
  sortNode(root);
  return root.children;
}
