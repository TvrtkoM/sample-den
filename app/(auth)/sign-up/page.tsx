import PublicGuard from "@/components/auth/PublicGuard";
import SignUpForm from "@/components/auth/SignUpForm";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignUpPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <div className="flex justify-between mb-8 mt-4">
          <h1>Sign Up</h1>
          <BackButton />
        </div>
        <SignUpForm />
        <p className="mt-3">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link
              href={{ pathname: "/sign-in", query: { backUrl: "/sign-up" } }}
            >
              Sign In
            </Link>
          </Button>
        </p>
      </main>
    </PublicGuard>
  );
}
