import { format } from "date-fns";

export function formatSecondsDuration(seconds: number): string {
  if (!seconds || seconds === Infinity) return "00:00"
  return format(seconds * 1000, "mm:ss")
}
