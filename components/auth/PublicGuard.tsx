"use client";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const PublicGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const isAuth = session != null && session.user.isAnonymous !== true;

  useEffect(() => {
    if (isAuth) {
      router.replace("/samples");
    }
  }, [isAuth, router]);

  if (isAuth) {
    return null;
  }

  return <>{children}</>;
};

export default PublicGuard;
