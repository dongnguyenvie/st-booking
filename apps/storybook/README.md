# storybook

The workbench for `@repo/ui` — every shared component in isolation, plus the
design tokens they are built on.

```bash
pnpm --filter storybook dev      # http://localhost:3004
pnpm --filter storybook build    # static site into dist/
```

## Where the styling comes from

Components in `@repo/ui` are styled with utility classes pointing at CSS
variables (`bg-primary`, `text-muted-foreground`). Rendered without those
variables defined they come out as unstyled default form controls — which is
exactly what Storybook would show, since it renders them with no app around
them.

So `.storybook/preview.css` imports the same token file `apps/frontend` does:

```
packages/ui/src/styles/tokens.css   ← the single palette
  ├── apps/frontend/app/globals.css
  └── apps/storybook/.storybook/preview.css
```

The tokens moved into `@repo/ui` as part of adding this app. They had lived in
the frontend's `globals.css`, which meant the components and the values they
depend on sat in different packages — fine while there was one consumer, wrong
as soon as there were two.

Two things that are easy to get wrong here:

- **`@source` matters.** Tailwind scans for class usage, so
  `preview.css` has to point at `packages/ui/src`. Without it Tailwind sees only
  the story files and emits none of the utilities the components use.
- **`@theme static`, not `@theme`.** A plain `@theme` is tree-shaken to the
  variables some scanned class references. The `mk-*` marketplace set is used by
  `apps/frontend` and by nothing in `@repo/ui`, and the shadow scale is applied
  via `var(--shadow-*)` rather than a utility — so under a plain `@theme` both
  drop out and the Foundations page reads them back empty. `static` makes the
  token set a fixed contract instead of a function of what the current consumer
  happens to use.

## Theme switching

The `Theme` toolbar control toggles a `.dark` class on the story wrapper, which
is all the `@custom-variant dark (&:is(.dark *))` in the stylesheet needs. There
is no theme provider — the tokens do the work.

## Writing stories

Stories live in `src/`, named `<component>.stories.tsx`, colocated by area
(`components/`, `foundations/`). `tags: ['autodocs']` generates the Docs page
from the component's props.

Prefer `satisfies Meta<typeof X>` so args stay type-checked against the
component. The exception is a `meta` that declares `decorators`: that makes the
inferred type reference Storybook's internal CSF module, which `tsc` cannot name
under `declaration`, so those use an explicit `const meta: Meta<typeof X>`
annotation instead.

## a11y

`@storybook/addon-a11y` runs axe on every story, reporting under the
Accessibility tab. It is set to `test: 'todo'` — violations are surfaced, not
enforced. Findings on shared primitives are usually a design conversation rather
than a build break; tighten to `'error'` when the set is clean.
