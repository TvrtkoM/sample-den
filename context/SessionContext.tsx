import type { auth } from "@/lib/auth";
import { createContext, use, useContext } from "react";

type Session = typeof auth.$Infer.Session | null;

export const SessionContext = createContext<Promise<Session> | null>(null);

export function useSessionContext() {
  const sessionPromise = useContext(SessionContext);
  if (!sessionPromise) return null;
  return use(sessionPromise);
}
