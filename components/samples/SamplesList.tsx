"use client";

import { useSamples } from "@/hooks/queries/useSamples";

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
          <li key={sample._id} className="border rounded p-4">
            <h2 className="text-lg font-medium">{sample.title}</h2>

            {sample.previewFile?.asset?.url && (
              <audio
                controls
                src={sample.previewFile.asset.url}
                className="mt-2 w-full"
              />
            )}

            {sample.categories?.length ? (
              <p className="mt-2 text-sm text-gray-500">
                {sample.categories
                  .map((c) => c?.title)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
