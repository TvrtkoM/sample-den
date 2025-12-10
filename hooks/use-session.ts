import { useSessionContext } from "@/context/SessionContext";
import { useSessionAuth } from "@/lib/auth-client";

export function useSession() {
  const initialSession = useSessionContext();
  const { data: clientSession } = useSessionAuth();

  const session = clientSession ?? initialSession;

  return { data: session };
}