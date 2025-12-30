"use client";

import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export function RefetchSessionOnUnmount() {
  const { refetch } = useSession();

  useEffect(() => {
    return () => {
      refetch();
    };
  }, [refetch]);

  return null;
}
