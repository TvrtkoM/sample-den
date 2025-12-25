import PublicGuard from "@/components/auth/PublicGuard";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <h1 className="mb-8 mt-4">Sign In</h1>
        <SignInForm />
        <p className="mt-3">
          Don&apos;t have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href={{ pathname: "/sign-up" }}>Sign Up</Link>
          </Button>
        </p>
      </main>
    </PublicGuard>
  );
}
