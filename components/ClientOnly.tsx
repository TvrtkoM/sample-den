"use client";
import { useIsClient } from "@uidotdev/usehooks";
import { ReactNode } from "react";

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{isClient ? children : null}</>;
};

export default ClientOnly;
