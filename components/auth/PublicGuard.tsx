"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const PublicGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/samples");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return null;
  }

  if (session?.user) {
    return null;
  }

  return <>{children}</>;
};

export default PublicGuard;
