'use client';

import { ShowcaseCard } from '../components-showcase-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/ui/components/collapsible';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@repo/ui/components/resizable';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Card, CardContent } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { ChevronsUpDown } from 'lucide-react';

export function ComponentsSectionLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ShowcaseCard title="Accordion" description="Collapsible Q&A / FAQ panels">
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger className="text-sm">What is shadcn/ui?</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">
              Beautifully designed components built on Radix UI and Tailwind CSS.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger className="text-sm">Is it free?</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">
              Yes. Open source and free to use in personal and commercial projects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger className="text-sm">Does it support Tailwind v4?</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">
              Yes, shadcn/ui fully supports Tailwind CSS v4 with CSS-first config.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseCard>

      <ShowcaseCard title="Collapsible" description="Single expandable section">
        <Collapsible>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Repositories</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-3 py-2 text-sm mt-2">@radix-ui/react-collapsible</div>
          <CollapsibleContent className="space-y-1 mt-1">
            <div className="rounded-md border px-3 py-2 text-sm">@radix-ui/react-dialog</div>
            <div className="rounded-md border px-3 py-2 text-sm">@radix-ui/react-dropdown-menu</div>
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseCard>

      <ShowcaseCard title="Resizable" description="Drag-to-resize split panels">
        <ResizablePanelGroup className="rounded-md border h-32">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Left</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Right</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ShowcaseCard>

      <ShowcaseCard title="Carousel" description="Slide-based content scroller">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {['Slide 1', 'Slide 2', 'Slide 3'].map((slide) => (
              <CarouselItem key={slide}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold text-muted-foreground">{slide}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </ShowcaseCard>
    </div>
  );
}
