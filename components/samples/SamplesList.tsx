"use client";

import { useSamples } from "@/hooks/queries/useSamples";
import SampleItem from "./SampleItem";

export default function SamplesList() {
  const { isLoading, data } = useSamples();

  if (isLoading) return <p>Loading…</p>;
  if (!data?.allSample.length) return <p>No samples found.</p>;

  return (
    <ul className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {data.allSample.map((sample) => (
        <SampleItem key={sample._id} sample={sample} />
      ))}
    </ul>
  );
}
