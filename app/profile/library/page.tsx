import LibraryItem from "@/components/library/LibraryItem";
import { Button } from "@/components/ui/button";
import { fetchSamplesByIds } from "@/lib/fetch/samples";
import { getSession } from "@/lib/getSession";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function LibraryPage() {
  const session = await getSession();

  const purchases = await prisma.purchase.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" }
  });

  if (purchases.length === 0) {
    return (
      <section className="card-shadow-sm p-6 container-small">
        <h2 className="mb-2">No purchases yet</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Browse the catalog to find samples you like.
        </p>
        <div className="flex justify-start">
          <Button asChild>
            <Link href="/samples">Browse samples</Link>
          </Button>
        </div>
      </section>
    );
  }

  const samples = await fetchSamplesByIds(purchases.map((p) => p.sampleId));
  const sampleById = new Map(samples.map((s) => [s._id, s]));

  return (
    <section>
      <h2 className="mb-4">Library</h2>
      <ul className="flex flex-col gap-3">
        {purchases.map((purchase) => (
          <LibraryItem
            key={purchase.id}
            purchase={{
              id: purchase.id,
              priceInCents: purchase.priceInCents,
              createdAt: purchase.createdAt.toISOString(),
              sampleId: purchase.sampleId
            }}
            sample={sampleById.get(purchase.sampleId) ?? null}
          />
        ))}
      </ul>
    </section>
  );
}
