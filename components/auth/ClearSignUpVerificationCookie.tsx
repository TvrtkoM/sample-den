"use client";

import { useEffect } from "react";

export function ClearSignUpVerificationCookie() {
  useEffect(() => {
    document.cookie = "signUpVerification=; path=/; max-age=0";
  }, []);

  return null;
}
