// utilities that are used in both server and client components
import { format } from "date-fns";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const priceFromCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function formatSecondsDuration(seconds: number): string {
  if (!seconds || seconds === Infinity) return "00:00";
  return format(seconds * 1000, "mm:ss");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAnonymousUserIdCookie(userId?: string) {
  if (userId) {
    return `anonymous-user-id=${userId}; path=/; max-age=300; SameSite=Lax`;
  }
  return "anonymous-user-id=; Path=/; Max-Age=0; SameSite=Lax";
}

export function getSignUpVerificationCookie(clear?: true) {
  if (clear) {
    return "signUpVerification=; path=/; max-age=0";
  }
  return "signUpVerification=true; path=/; max-age=3600; SameSite=Lax";
}
