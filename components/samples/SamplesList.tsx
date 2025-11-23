"use client";

import { useSamples } from "@/hooks/queries/useSamples";
import SampleItem from "./SampleItem";

export default function SamplesList() {
  const { isLoading, error, data } = useSamples();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load samples.</p>;
  if (!data?.allSample.length) return <p>No samples found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Samples</h1>
      <ul className="space-y-4">
        {data.allSample.map((sample) => (
          <SampleItem key={sample._id} sample={sample} />
        ))}
      </ul>
    </main>
  );
}
