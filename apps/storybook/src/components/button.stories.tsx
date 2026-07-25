import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@repo/ui/components/button';
import { ArrowRight, Loader2, Trash2 } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
    asChild: { table: { disable: true } },
  },
  args: { children: 'Continue' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every variant side by side — the view for choosing one. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
};

/**
 * The base class sizes any child `svg` to 1rem and kills its pointer events, so
 * an icon needs no wrapper or sizing class of its own.
 */
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        Continue <ArrowRight />
      </Button>
      <Button variant="outline">
        <Trash2 /> Delete
      </Button>
    </div>
  ),
};

/**
 * There is no `loading` prop. A pending button is a disabled button with a
 * spinning icon, which keeps the spinner's label the caller's decision.
 */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" /> Signing…
    </Button>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * `asChild` hands the styling to whatever element you pass, so a link can look
 * like a button without nesting an `<a>` inside a `<button>`.
 */
export const AsLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Button asChild>
      <a href="https://example.com">Anchor styled as a button</a>
    </Button>
  ),
};
