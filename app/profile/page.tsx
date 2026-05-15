import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <section>
      <h2 className="mb-3">Welcome</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Your purchased samples are available in your library.
      </p>
      <Button asChild>
        <Link href="/profile/library">Go to Library</Link>
      </Button>
    </section>
  );
}
