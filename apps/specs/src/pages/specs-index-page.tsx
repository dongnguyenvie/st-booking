import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { corpus } from '../core/corpus';
import { downloadCorpus } from '../core/export-corpus';

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function SpecsIndexPage() {
  useEffect(() => {
    document.title = 'Spec Hub';
  }, []);

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Specs</h1>
          <p className="mt-1 text-slate-500">Pick a spec to read before it gets built.</p>
        </div>

        {corpus.length > 0 ? (
          <button
            type="button"
            onClick={() => downloadCorpus()}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Export corpus
          </button>
        ) : null}
      </div>

      {corpus.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {corpus.map((spec) => (
            <li key={spec.slug}>
              <Link
                to={`/specs/${spec.slug}`}
                className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-semibold text-slate-900">{spec.title}</h2>
                  {spec.updatedAt ? (
                    <span className="shrink-0 text-xs text-slate-400">Updated {formatDate(spec.updatedAt)}</span>
                  ) : null}
                </div>
                {spec.description ? <p className="mt-1 text-sm text-slate-500">{spec.description}</p> : null}
                <code className="mt-2 inline-block text-xs text-slate-400">{spec.slug}.md</code>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">No specs yet.</p>
          <p className="mt-1 text-sm text-slate-400">
            Add a markdown file under <code>apps/specs/specs/</code> and refresh.
          </p>
        </div>
      )}
    </section>
  );
}
