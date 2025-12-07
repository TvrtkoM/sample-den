import PublicGuard from "@/components/auth/PublicGuard";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <PublicGuard>
      <main className="container-small">
        <h1 className="mb-8 mt-4">Sign In</h1>
        <SignInForm />
      </main>
    </PublicGuard>
  );
}
