'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { ComponentsSectionInputs } from './sections/components-section-inputs';
import { ComponentsSectionDisplay } from './sections/components-section-display';
import { ComponentsSectionOverlay } from './sections/components-section-overlay';
import { ComponentsSectionNavigation } from './sections/components-section-navigation';
import { ComponentsSectionLayout } from './sections/components-section-layout';

const TABS = [
  { id: 'inputs', label: 'Inputs & Form' },
  { id: 'display', label: 'Display' },
  { id: 'overlay', label: 'Overlays' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'layout', label: 'Layout' },
] as const;

export function ComponentsPageFeature() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Component Showcase</h1>
        <p className="text-sm text-muted-foreground mt-1">All 46 shadcn/ui components — live demos</p>
      </div>

      <Tabs defaultValue="inputs">
        <TabsList className="flex-wrap h-auto gap-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="inputs" className="mt-6">
          <ComponentsSectionInputs />
        </TabsContent>
        <TabsContent value="display" className="mt-6">
          <ComponentsSectionDisplay />
        </TabsContent>
        <TabsContent value="overlay" className="mt-6">
          <ComponentsSectionOverlay />
        </TabsContent>
        <TabsContent value="navigation" className="mt-6">
          <ComponentsSectionNavigation />
        </TabsContent>
        <TabsContent value="layout" className="mt-6">
          <ComponentsSectionLayout />
        </TabsContent>
      </Tabs>
    </div>
  );
}
