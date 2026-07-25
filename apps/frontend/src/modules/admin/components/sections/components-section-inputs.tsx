'use client';

import { useState } from 'react';
import { ShowcaseCard } from '../components-showcase-card';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Label } from '@repo/ui/components/label';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Switch } from '@repo/ui/components/switch';
import { Slider } from '@repo/ui/components/slider';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { Toggle } from '@repo/ui/components/toggle';
import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';

export function ComponentsSectionInputs() {
  const [slider, setSlider] = useState([50]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ShowcaseCard title="Button" description="Primary actions">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Input" description="Text input field">
        <div className="space-y-2">
          <Label htmlFor="demo-input">Email</Label>
          <Input id="demo-input" placeholder="Enter email..." />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Textarea" description="Multi-line text input">
        <Textarea placeholder="Write something..." rows={3} />
      </ShowcaseCard>

      <ShowcaseCard title="Select" description="Dropdown selector">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseCard>

      <ShowcaseCard title="Checkbox" description="Boolean selection">
        <div className="space-y-2">
          {['Notifications', 'Newsletter', 'Updates'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Checkbox id={item} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Switch" description="Toggle on/off">
        <div className="space-y-3">
          {['Dark mode', 'Emails', '2FA'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <Label>{item}</Label>
              <Switch />
            </div>
          ))}
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Radio Group" description="Single selection from set">
        <RadioGroup defaultValue="option-1">
          {['Option 1', 'Option 2', 'Option 3'].map((o, i) => (
            <div key={o} className="flex items-center gap-2">
              <RadioGroupItem value={`option-${i + 1}`} id={`r-${i}`} />
              <Label htmlFor={`r-${i}`}>{o}</Label>
            </div>
          ))}
        </RadioGroup>
      </ShowcaseCard>

      <ShowcaseCard title="Slider" description="Range input">
        <Slider value={slider} onValueChange={setSlider} max={100} step={1} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-2">Value: {slider[0]}</p>
      </ShowcaseCard>

      <ShowcaseCard title="Toggle" description="Stateful icon button">
        <div className="flex gap-2">
          <Toggle aria-label="Bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Toggle Group" description="Single / multi toggle">
        <ToggleGroup type="single">
          <ToggleGroupItem value="b">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="i">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="u">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseCard>
    </div>
  );
}
