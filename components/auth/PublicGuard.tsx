"use client";
import { getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useEffectEvent, useState } from "react";

const PublicGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const checkSession = useEffectEvent(async () => {
    setIsCheckingSession(true);
    const session = await getSession();
    if (session.error) {
      console.error("Session error", session.error.message);
    } else {
      const isAuth = session.data?.user.isAnonymous === false;
      if (isAuth) {
        router.replace("/samples");
      } else {
        setIsCheckingSession(false);
      }
    }
  });

  useEffect(() => {
    checkSession();
  }, []);

  if (isCheckingSession) {
    return null;
  }

  return <>{children}</>;
};

export default PublicGuard;
