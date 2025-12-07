"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <main className="container">
        <p>Loading</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="container">
        <p>Redirecting...</p>
      </main>
    );
  }

  const { user } = session;

  return (
    <main className="container">
      <h1>Welcome, {user.name || "User"}!</h1>
      <Button onClick={() => signOut()}>Sign out</Button>
    </main>
  );
}
