import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import { signOutAction } from "@/lib/server-actions/auth";

const UserPageImpl = async ({ headers }: { headers: Promise<HeadersInit> }) => {
  const session = await auth.api.getSession({ headers: await headers });

  if (!session?.user) redirect("/sign-in");

  const signOut = async () => {
    "use server";
    await signOutAction();
    redirect("/sign-in");
  };

  return (
    <main className="container">
      <h1>Welcome, {session?.user.name || "User"}!</h1>
      <form action={signOut}>
        <Button type="submit">Sign Out</Button>
      </form>
    </main>
  );
};

export default async function UserPage() {
  return (
    <Suspense>
      <UserPageImpl headers={headers()} />
    </Suspense>
  );
}
