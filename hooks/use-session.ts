import { useSessionContext } from "@/context/SessionContext";
import { useSessionAuth } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

export function useSession() {
  const initialSession = useSessionContext();
  const { data: clientSession, isPending, refetch } = useSessionAuth();

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isHydrated || isPending) {
    return { session: initialSession, refetch: undefined, isPending: true };
  }

  return { session: clientSession, refetch, isPending };
}
