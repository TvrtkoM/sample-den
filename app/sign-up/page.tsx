"use client";

import PublicGuard from "@/components/auth/PublicGuard";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <h1 className="mb-8 mt-4">Sign Up</h1>
        <SignUpForm />
      </main>
    </PublicGuard>
  );
}
