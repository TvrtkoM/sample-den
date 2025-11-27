import { format } from "date-fns";

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatSecondsDuration(seconds: number): string {
  if (!seconds || seconds === Infinity) return "00:00"
  return format(seconds * 1000, "mm:ss")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
