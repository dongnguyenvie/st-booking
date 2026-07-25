import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';

// Annotated rather than `satisfies`: a decorator in `meta` makes the inferred
// type reference storybook's internal CSF module, which tsc cannot name.
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'file'] },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'you@company.com' },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true, value: 'locked@company.com' } };

/**
 * `Input` renders a bare `<input>` — no label, no error slot. Pair it with
 * `Label` and wire `htmlFor` yourself, so the association is explicit rather
 * than generated.
 */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Work email</Label>
      <Input id="email" type="email" placeholder="you@company.com" />
    </div>
  ),
};

export const WithHelpText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount requested</Label>
      <Input id="amount" type="number" placeholder="48000" aria-describedby="amount-help" />
      <p id="amount-help" className="text-xs text-muted-foreground">
        Between $5,000 and $150,000.
      </p>
    </div>
  ),
};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-3">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
      <Input type="file" />
    </div>
  ),
};
