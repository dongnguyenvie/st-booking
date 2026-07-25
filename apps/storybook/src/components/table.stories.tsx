import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { Badge } from '@repo/ui/components/badge';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const offers = [
  { lender: 'Meridian Capital', apr: '6.91%', term: '24 mo', payment: '$2,144.00', state: 'New' },
  { lender: 'Harbour Credit', apr: '7.40%', term: '24 mo', payment: '$2,156.31', state: 'Viewed' },
  { lender: 'Foundry Lending', apr: '8.15%', term: '36 mo', payment: '$1,571.02', state: 'Viewed' },
];

/**
 * Figures are right-aligned so the decimal points line up down the column —
 * a ranked list is unreadable otherwise.
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Offers, ranked best rate first.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Lender</TableHead>
          <TableHead className="text-right">APR</TableHead>
          <TableHead className="text-right">Term</TableHead>
          <TableHead className="text-right">Monthly payment</TableHead>
          <TableHead>State</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => (
          <TableRow key={offer.lender}>
            <TableCell className="font-medium">{offer.lender}</TableCell>
            <TableCell className="text-right">{offer.apr}</TableCell>
            <TableCell className="text-right">{offer.term}</TableCell>
            <TableCell className="text-right">{offer.payment}</TableCell>
            <TableCell>
              <Badge variant={offer.state === 'New' ? 'success' : 'secondary'}>{offer.state}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Funding</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Working capital · Mar 2026</TableCell>
          <TableCell className="text-right">$32,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Equipment · Nov 2025</TableCell>
          <TableCell className="text-right">$18,500</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total funded</TableCell>
          <TableCell className="text-right">$50,500</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
