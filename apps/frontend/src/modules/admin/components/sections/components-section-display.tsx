'use client';

import { ShowcaseCard } from '../components-showcase-card';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Progress } from '@repo/ui/components/progress';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Separator } from '@repo/ui/components/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table';
import { AspectRatio } from '@repo/ui/components/aspect-ratio';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { AlertCircle } from 'lucide-react';

export function ComponentsSectionDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ShowcaseCard title="Avatar" description="User representation">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>NL</AvatarFallback>
          </Avatar>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Badge" description="Status indicators">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Danger</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Skeleton" description="Loading placeholder">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Progress" description="Completion indicator">
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Upload — 75%</p>
            <Progress value={75} />
          </div>
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Processing — 40%</p>
            <Progress value={40} />
          </div>
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Complete — 100%</p>
            <Progress value={100} />
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Alert" description="Inline feedback messages">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong. Please try again.</AlertDescription>
        </Alert>
      </ShowcaseCard>

      <ShowcaseCard title="Separator" description="Visual divider">
        <div className="space-y-3">
          <p className="text-sm">Above separator</p>
          <Separator />
          <p className="text-sm">Below separator</p>
          <div className="flex items-center gap-3 h-5">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Table" description="Data rows">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Alice', 'Admin', 'Active'],
              ['Bob', 'Editor', 'Inactive'],
            ].map(([n, r, s]) => (
              <TableRow key={n}>
                <TableCell>{n}</TableCell>
                <TableCell>{r}</TableCell>
                <TableCell>
                  <Badge variant={s === 'Active' ? 'success' : 'secondary'}>{s}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseCard>

      <ShowcaseCard title="Aspect Ratio" description="Constrained proportions">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">16:9</span>
        </AspectRatio>
      </ShowcaseCard>

      <ShowcaseCard title="Scroll Area" description="Overflow with custom scrollbar">
        <ScrollArea className="h-32 rounded-md border p-2">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-sm py-1 border-b last:border-0">
              List item {i + 1}
            </p>
          ))}
        </ScrollArea>
      </ShowcaseCard>
    </div>
  );
}
