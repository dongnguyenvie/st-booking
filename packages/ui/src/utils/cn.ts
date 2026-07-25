import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely — use throughout all components */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
