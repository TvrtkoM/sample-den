"use client";

import { getSignUpVerificationCookie } from "@/lib/utils";
import { useEffect } from "react";

export function ClearSignUpVerificationCookie() {
  useEffect(() => {
    document.cookie = getSignUpVerificationCookie(true);
  }, []);

  return null;
}
