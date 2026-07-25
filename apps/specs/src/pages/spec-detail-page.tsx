import { useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { findSpec } from '../core/corpus';
import { renderMarkdown } from '../core/markdown';
import { specMemory, type SpecLink } from '../core/memory';

function DependencyList({ heading, links, memoryMode }: { heading: string; links: SpecLink[]; memoryMode: boolean }) {
  if (links.length === 0) return null;
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{heading}</h2>
      <ul className="space-y-1">
        {links.map((dep) => (
          <li key={dep.slug}>
            <Link
              to={`/specs/${dep.slug}${memoryMode ? '?view=memory' : ''}`}
              className="text-sm text-slate-700 underline decoration-slate-300 hover:decoration-slate-600"
            >
              {dep.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecDetailPage() {
  const params = useParams();
  const slug = params['*'] ?? '';
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode lives in the URL (?view=memory) so it's shareable, and so links
  // between specs carry it — staying in Memory mode as you walk the graph.
  const isMemory = searchParams.get('view') === 'memory';

  const spec = findSpec(slug);
  const html = useMemo(() => (spec ? renderMarkdown(spec.content) : ''), [spec]);
  const memory = useMemo(() => (isMemory ? specMemory(slug) : null), [isMemory, slug]);

  useEffect(() => {
    document.title = spec ? `${spec.title} · Spec Hub` : 'Spec Hub';
  }, [spec]);

  if (!spec) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-medium text-slate-700">Spec not found</p>
        <p className="mt-1 text-sm text-slate-400">{slug}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-slate-500 underline">
          Back to all specs
        </Link>
      </div>
    );
  }

  return (
    <article>
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">
          ← All specs
        </Link>

        {/* Doc / Memory switch. Memory = what the retrieval layer stores for this spec. */}
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded px-2.5 py-1 transition ${
              !isMemory ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Doc
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ view: 'memory' })}
            className={`rounded px-2.5 py-1 transition ${
              isMemory ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Memory
          </button>
        </div>
      </div>

      {!isMemory ? (
        // The markdown is authored in this repo, not user input, so rendering it
        // as HTML is the point — `html: true` in markdown.ts exists so specs can
        // use inline HTML where a table or diagram needs it.
        <div className="prose prose-slate mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      ) : memory ? (
        <section className="mt-6 space-y-8">
          <header>
            <h1 className="text-xl font-semibold text-slate-900">{memory.title}</h1>
            {memory.description ? <p className="mt-1 text-sm text-slate-500">{memory.description}</p> : null}
            <p className="mt-2 text-xs text-slate-400">
              {memory.chunks.length} retrieval chunk{memory.chunks.length === 1 ? '' : 's'} · this is what search and AI
              retrieval see.
            </p>
          </header>

          {memory.dependsOn.length > 0 || memory.dependents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <DependencyList heading="Builds on" links={memory.dependsOn} memoryMode />
              <DependencyList heading="Used by" links={memory.dependents} memoryMode />
            </div>
          ) : null}

          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Chunks</h2>
            <ol className="space-y-3">
              {memory.chunks.map((chunk, i) => (
                <li key={`${chunk.heading}-${i}`} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-500">
                    <span className="text-slate-400">#{i + 1}</span> {chunk.heading || '(intro)'}
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-600">
                    {chunk.text}
                  </pre>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </article>
  );
}
