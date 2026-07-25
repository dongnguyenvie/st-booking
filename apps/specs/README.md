# @repo/specs — Spec Hub

A deliberately tiny app for **spec-first** work: drop a markdown file into
`specs/` and it renders as a styled page, appears in the nav tree, and becomes
searchable — before any code exists.

```bash
pnpm --filter @repo/specs dev      # http://localhost:3002
pnpm --filter @repo/specs build
```

## No backend

React + Vite, and nothing else. `specs/**/*.md` is inlined into the bundle at
build time via `import.meta.glob`, so there is no server, no database and no API
route in front of the corpus. The filesystem stays the single source of truth for
the page list, the tree and the dependency graph.

That trade is deliberate. Search, the tree and the graph were pure functions over
the corpus even in the Nuxt/Nitro version this replaced — the server was only
there to read files. With the corpus in the bundle:

- **Search is synchronous.** It was debounced at 200 ms to hide a `/api/search`
  round trip. There is no round trip now, so results land on keystroke.
- **The retrieval index is built once**, at module load, instead of per request.

The cost: adding a spec needs a rebuild rather than a refresh. In dev that is what
HMR already does, and the corpus is small enough that shipping it whole is
cheaper than the infrastructure to serve it.

**Dropped in the move:** reviewer comments — the one feature that genuinely
needed persistence. They lived in `.data/comments/<slug>.json`, with a
Linear-backed store behind the same interface. Bring back a server if you want
them; nothing else here needs one.

## Adding a spec

Create `specs/my-feature.md`. Subfolders work:
`specs/canmorestays/06-booking-pricing.md` → `/specs/canmorestays/06-booking-pricing`.

```yaml
---
title: Booking & pricing
description: Quote breakdown, availability rules, and the checkout path.
order: 6
depends_on: ['canmorestays/05-listing-detail']
---
```

Every field is optional. Without `title` it falls back to the first `# heading`,
then the filename. `order` sorts the tree and index (lower first); unordered
specs sort last, by title. `depends_on` builds the dependency graph — the reverse
direction ("Used by") is derived, so each edge is declared once.

`specs/canmorestays/_index.md` describes the `canmorestays` folder in the tree
rather than adding a child node to it.

## Doc / Memory

Every spec page has a `Doc` / `Memory` toggle. The mode lives in the URL
(`?view=memory`) so it is shareable, and links between specs carry it — you stay
in Memory mode as you walk the dependency graph.

**Memory** shows the corpus the way retrieval consumes it rather than the way a
human reads it: the spec split into chunks (one per `##`/`###` section), plus its
place in the graph. `src/core/rag.ts` scores chunks by term overlap — a tiny TF
measure, zero infra. It is marked as a swap point: replace the body of
`retrieve()` with an embedding similarity search over the same chunks and every
caller stays unchanged.

**Export corpus**, on the index page, renders the whole corpus as one markdown
document and downloads it — the "feed the entire spec tree to an AI" primitive,
and the exact text an indexer would chunk.

## Deploying

`dist/` is static, but this is a client-routed SPA: whatever serves it must fall
back to `index.html` for unknown paths, or a deep link like
`/specs/canmorestays/06-booking-pricing` will 404 on refresh. `vite preview` already
does this.

## Where the specs come from

The specs under `specs/canmorestays/` are reverse-engineered from
[canmorestays.com](https://www.canmorestays.com), with captured evidence in
`specs/canmorestays/01-overview-evidence.md`. When the observed site changes,
the spec is what gets updated first.
