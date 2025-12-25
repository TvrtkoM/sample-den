import PublicGuard from "@/components/auth/PublicGuard";
import SignUpForm from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignUpPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <h1 className="mb-8 mt-4">Sign Up</h1>
        <SignUpForm />
        <p className="mt-3">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href={{ pathname: "/sign-in" }}>Sign In</Link>
          </Button>
        </p>
      </main>
    </PublicGuard>
  );
}
