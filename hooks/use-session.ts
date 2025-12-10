import { useSessionContext } from "@/context/SessionContext";
import { useSessionAuth } from "@/lib/auth-client";

let isSessionHydrated = false;

const getIsSessionHydrated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return isSessionHydrated;
}

const setSessionHydrated = () => {
  if (typeof window !== 'undefined') {
    isSessionHydrated = true;
  }
}

export function useSession() {
  const initialSession = useSessionContext();
  const { data: clientSession, isPending } = useSessionAuth();

  if (!getIsSessionHydrated() && !isPending) {
    setSessionHydrated();
  }

  const session = getIsSessionHydrated() ? clientSession : initialSession;

  return { data: session };
}