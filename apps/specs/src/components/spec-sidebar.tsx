import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { corpus } from '../core/corpus';
import { buildTree } from '../core/tree';
import { retrieve } from '../core/rag';
import { SpecTree } from './spec-tree';

export function SpecSidebar() {
  const params = useParams();
  const currentSlug = params['*'] ?? '';
  const [query, setQuery] = useState('');

  const tree = useMemo(() => buildTree(corpus), []);

  // The Nuxt version debounced this because every keystroke hit /api/search.
  // Retrieval is now a synchronous pass over an in-memory index, so the round
  // trip — and the debounce that hid it — are both gone.
  const results = useMemo(() => (query.trim() ? retrieve(query) : []), [query]);

  return (
    <nav className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search specs…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />

      {query.trim() ? (
        results.length > 0 ? (
          <ul className="space-y-1">
            {results.map((r, i) => (
              <li key={`${r.slug}-${r.heading}-${i}`}>
                <Link
                  to={`/specs/${r.slug}`}
                  className="block rounded px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <span className="font-medium text-slate-800">{r.title}</span>
                  {r.heading ? <span className="text-slate-400"> › {r.heading}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-2 text-xs text-slate-400">No matches.</p>
        )
      ) : tree.length > 0 ? (
        <SpecTree nodes={tree} currentSlug={currentSlug} />
      ) : (
        <p className="px-2 text-xs text-slate-400">No specs yet.</p>
      )}
    </nav>
  );
}
