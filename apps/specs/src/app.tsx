import { Link, Route, Routes } from 'react-router-dom';
import { SpecSidebar } from './components/spec-sidebar';
import { SpecsIndexPage } from './pages/specs-index-page';
import { SpecDetailPage } from './pages/spec-detail-page';

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-sm text-white">§</span>
            Spec Hub
          </Link>
          <span className="ml-auto text-xs text-slate-400">Carousel Marketplace · Spec-First</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6">
            <SpecSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<SpecsIndexPage />} />
            {/* Slugs nest by folder, so the splat has to swallow the whole path. */}
            <Route path="/specs/*" element={<SpecDetailPage />} />
          </Routes>
        </main>
      </div>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Drop a <code>.md</code> file into <code>specs/</code> to publish a spec.
      </footer>
    </div>
  );
}
