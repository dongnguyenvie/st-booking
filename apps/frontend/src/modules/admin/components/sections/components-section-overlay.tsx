'use client';

import { useState } from 'react';
import { ShowcaseCard } from '../components-showcase-card';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/components/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/ui/components/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Toaster } from '@repo/ui/components/sonner';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

export function ComponentsSectionOverlay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Toaster />

      <ShowcaseCard title="Dialog" description="Modal dialog window">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm changes</DialogTitle>
              <DialogDescription>This action will update your profile settings.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseCard>

      <ShowcaseCard title="Alert Dialog" description="Destructive confirmation">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ShowcaseCard>

      <ShowcaseCard title="Sheet" description="Side panel / drawer">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>Manage your account settings here.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </ShowcaseCard>

      <ShowcaseCard title="Drawer" description="Bottom sheet (mobile-first)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer</DrawerTitle>
              <DrawerDescription>Swipe down or click outside to close.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="outline">Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ShowcaseCard>

      <ShowcaseCard title="Dropdown Menu" description="Contextual action list">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Options <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ShowcaseCard>

      <ShowcaseCard title="Popover" description="Floating content panel">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <p className="text-sm">This is popover content. Use it for filters, pickers, etc.</p>
          </PopoverContent>
        </Popover>
      </ShowcaseCard>

      <ShowcaseCard title="Tooltip" description="Hover hint">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>This is a tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseCard>

      <ShowcaseCard title="Hover Card" description="Rich preview on hover">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@nolan</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm font-semibold">Nolan</p>
            <p className="text-xs text-muted-foreground">Admin · Joined Apr 2026</p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseCard>

      <ShowcaseCard title="Context Menu" description="Right-click menu">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-16 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseCard>

      <ShowcaseCard title="Command" description="Search palette (Cmd+K)">
        <Command className="rounded-md border">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem>Dashboard</CommandItem>
              <CommandItem>Users</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </ShowcaseCard>

      <ShowcaseCard title="Sonner (Toast)" description="Notification toasts">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast('Info message')}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success('Saved!')}>
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.error('Failed!')}>
            Error
          </Button>
          <Button variant="outline" onClick={() => toast.warning('Warning!')}>
            Warning
          </Button>
        </div>
      </ShowcaseCard>
    </div>
  );
}
