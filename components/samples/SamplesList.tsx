"use client";

import { useSamples } from "@/hooks/queries/useSamples";
import SampleItem from "./SampleItem";
import AppPagination from "../AppPagination";
import { useState } from "react";
import { defaultSamplesPageSize } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";

export default function SamplesList() {
  const [pageNum, setPageNum] = useState(1);
  const { data, isFetched } = useSamples(pageNum);

  const samples = data?.allSample ?? [];

  if (isFetched && samples.length == 0) return <p>No samples found.</p>;

  return (
    <>
      <ul className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {!isFetched
          ? Array.from({ length: defaultSamplesPageSize }, (_, i) => (
              <Skeleton key={i} className="w-full h-64" />
            ))
          : samples.map((sample) => (
              <SampleItem key={sample._id} sample={sample} />
            ))}
      </ul>
      <div className="container">
        {isFetched ? (
          <AppPagination
            pageNum={pageNum}
            totalPages={2}
            onPageChange={(nextPage) => setPageNum(nextPage)}
          />
        ) : (
          <Skeleton className="w-full h-9" />
        )}
      </div>
    </>
  );
}
