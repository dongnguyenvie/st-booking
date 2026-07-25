import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Working capital</CardTitle>
        <CardDescription>Up to $150,000, funded in as little as two days.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your verified profile already qualifies for this product — no re-verification needed.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Request financing</Button>
      </CardFooter>
    </Card>
  ),
};

/** A card carrying figures — the shape most of the marketplace surface uses. */
export const OfferCard: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Meridian Capital</CardTitle>
            <CardDescription>Best rate</CardDescription>
          </div>
          <Badge variant="success">6.91%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">$48,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Term</span>
          <span className="font-medium">24 months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monthly payment</span>
          <span className="font-medium">$2,144.00</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">Sign LOI</Button>
        <Button variant="outline" className="flex-1">
          Details
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** `CardFooter` is optional — omit it when the card is purely informational. */
export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Verification freshness</CardTitle>
        <CardDescription>Two checks have aged out since your last funded cycle.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge variant="warning">Business bank</Badge>
        <Badge variant="warning">Registration</Badge>
      </CardContent>
    </Card>
  ),
};
