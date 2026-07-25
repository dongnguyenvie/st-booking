import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { AlertTriangle, Info } from 'lucide-react';

// Annotated rather than `satisfies`: a decorator in `meta` makes the inferred
// type reference storybook's internal CSF module, which tsc cannot name.
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The base class positions a direct `svg` child absolutely and indents the text
 * around it, so the icon goes at the top level of `Alert` — not inside
 * `AlertTitle`.
 */
export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Two lenders are still pricing</AlertTitle>
      <AlertDescription>
        They are listed below the ranked offers until they come back with a number.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Verification expired</AlertTitle>
      <AlertDescription>
        Your business bank connection has aged out. Some lenders will not price until it is refreshed.
      </AlertDescription>
    </Alert>
  ),
};

/** `AlertTitle` is optional when the message is a single sentence. */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>Funds typically arrive within 38 hours of the final approval.</AlertDescription>
    </Alert>
  ),
};
