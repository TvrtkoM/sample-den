import PublicGuard from "@/components/auth/PublicGuard";
import SignInForm from "@/components/auth/SignInForm";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <div className="flex justify-between mb-8 mt-4">
          <h1>Sign In</h1>
          <BackButton />
        </div>
        <SignInForm />
        <p className="mt-3">
          Don&apos;t have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link
              href={{ pathname: "/sign-up", query: { backUrl: "/sign-in" } }}
            >
              Sign Up
            </Link>
          </Button>
        </p>
      </main>
    </PublicGuard>
  );
}
