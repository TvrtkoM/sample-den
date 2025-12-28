"use client";

import {
  useSetSignUpVerification,
  useSignUpVerification
} from "@/lib/store/signUp";
import { usePathname } from "next/navigation";

const ResetVerificationFlag = () => {
  const signUpVerification = useSignUpVerification();
  const setSignUpVerification = useSetSignUpVerification();
  const pathname = usePathname();

  if (signUpVerification && pathname !== "/verify") {
    setSignUpVerification(false);
  }
  return null;
};

export default ResetVerificationFlag;
