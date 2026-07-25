import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';

interface ShowcaseCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ShowcaseCard({ title, description, children }: ShowcaseCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
