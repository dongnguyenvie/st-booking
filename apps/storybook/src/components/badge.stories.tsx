import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@repo/ui/components/badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
    },
  },
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

/**
 * The status variants (`success` / `warning` / `info`) use the *subtle*
 * background with the solid colour as text, so a row of them stays readable
 * against a card. `destructive` is the loud one — reserve it for a real failure,
 * not for a neutral "closed" state.
 */
export const RequestStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="info">Gathering</Badge>
      <Badge variant="secondary">Offers in</Badge>
      <Badge variant="warning">Under LOI</Badge>
      <Badge variant="success">Funded</Badge>
      <Badge variant="outline">Closed</Badge>
    </div>
  ),
};
