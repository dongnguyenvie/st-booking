import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * The palette, read live from the stylesheet.
 *
 * Swatches resolve their colour from the CSS variable at render time rather
 * than from a hardcoded list, so this page cannot drift from
 * packages/ui/src/styles/tokens.css — a renamed or deleted token shows up here
 * as a missing swatch instead of a stale one that still looks right.
 */
function Swatch({ name }: { name: string }) {
  const variable = `--color-${name}`;
  const value =
    typeof window === 'undefined'
      ? ''
      : getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="min-w-0">
        <p className="truncate font-mono text-xs text-foreground">{name}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">{value || 'not defined'}</p>
      </div>
    </div>
  );
}

function Group({ title, note, names }: { title: string; note?: string; names: string[] }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {note ? <p className="mt-0.5 text-xs text-muted-foreground">{note}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((name) => (
          <Swatch key={name} name={name} />
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Design tokens',
  parameters: { layout: 'padded', controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colours: Story = {
  render: () => (
    <div className="space-y-10">
      <Group
        title="Brand & neutrals"
        note="Indigo primary on zinc neutrals — the admin back office palette."
        names={[
          'primary',
          'primary-foreground',
          'background',
          'foreground',
          'card',
          'card-foreground',
          'secondary',
          'secondary-foreground',
          'muted',
          'muted-foreground',
          'accent',
          'accent-foreground',
          'border',
          'input',
          'ring',
        ]}
      />

      <Group
        title="Semantic status"
        note="Each has a solid tone and a -subtle background. Badges pair subtle bg with solid text."
        names={[
          'success',
          'success-subtle',
          'warning',
          'warning-subtle',
          'info',
          'info-subtle',
          'destructive',
          'destructive-subtle',
        ]}
      />

      <Group
        title="Marketplace surface (mk-*)"
        note="Warm paper and a single clay accent. Namespaced because the prototype's names collide with the set above — these are additive utilities (bg-mk-paper), never overrides."
        names={[
          'mk-paper',
          'mk-paper-2',
          'mk-paper-3',
          'mk-card',
          'mk-ink',
          'mk-ink-2',
          'mk-line',
          'mk-clay',
          'mk-clay-soft',
          'mk-clay-deep',
          'mk-gain',
          'mk-gain-soft',
          'mk-loss',
          'mk-loss-soft',
          'mk-warn',
          'mk-warn-soft',
        ]}
      />
    </div>
  ),
};

export const RadiusAndShadow: Story = {
  render: () => (
    <div className="space-y-10">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Radius</h3>
        <div className="flex flex-wrap gap-4">
          {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
            <div key={size} className="space-y-2 text-center">
              <div
                className="h-16 w-16 border border-border bg-secondary"
                style={{ borderRadius: `var(--radius-${size})` }}
              />
              <p className="font-mono text-[11px] text-muted-foreground">{size}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Shadow</h3>
        <div className="flex flex-wrap gap-6">
          {['xs', 'sm', 'md', 'lg'].map((size) => (
            <div key={size} className="space-y-2 text-center">
              <div className="h-16 w-16 rounded-lg bg-card" style={{ boxShadow: `var(--shadow-${size})` }} />
              <p className="font-mono text-[11px] text-muted-foreground">{size}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
