import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const PublicGuard = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  const isAuth = session?.user && session.user.isAnonymous === false;

  if (isAuth) {
    redirect("/samples");
  }

  return <>{children}</>;
};

export default PublicGuard;
