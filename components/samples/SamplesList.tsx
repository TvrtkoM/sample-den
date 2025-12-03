"use client";

import useSamplesPage from "@/hooks/queries/useSamplesPage";
import { defaultSamplesPageSize } from "@/lib/constants";
import { useSamplesSearchParams } from "@/lib/search-params";
import { useDebounce } from "@uidotdev/usehooks";
import { Suspense } from "react";
import AppPagination from "../AppPagination";
import { Skeleton } from "../ui/skeleton";
import SampleItem from "./SampleItem";

const SamplesList = ({ page, search }: { page: number; search: string }) => {
  const {
    data: { samples }
  } = useSamplesPage(page, search);

  if (samples.length === 0) {
    return <h1 className="container py-8 sm:py-12">No samples found.</h1>;
  }
  return (
    <ul className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {samples.map((sample) => (
        <SampleItem key={sample._id} sample={sample} />
      ))}
    </ul>
  );
};

const SamplesSkeleton = () => {
  return (
    <div className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: defaultSamplesPageSize }, (_, i) => (
        <Skeleton key={i} className="w-full h-64" />
      ))}
    </div>
  );
};

const SamplesPagination = ({
  page,
  search,
  onPageChange
}: {
  page: number;
  search: string;
  onPageChange: (page: number) => void;
}) => {
  const {
    data: { totalCount }
  } = useSamplesPage(page, search);

  const totalPages =
    totalCount === 0 ? 0 : Math.ceil(totalCount / defaultSamplesPageSize);

  return (
    <AppPagination
      pageNum={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

const SamplesListContainer = () => {
  const [searchParams, setSearchParams] = useSamplesSearchParams();

  const debouncedParams = useDebounce(searchParams, 300);

  const search = debouncedParams.search;
  const page = searchParams.page;

  const pageChangeHandler = (nextPage: number) => {
    setSearchParams({
      page: nextPage
    });
  };

  return (
    <>
      <Suspense fallback={<SamplesSkeleton />}>
        <SamplesList page={page} search={search} />
      </Suspense>
      <Suspense>
        <SamplesPagination
          page={page}
          search={search}
          onPageChange={pageChangeHandler}
        />
      </Suspense>
    </>
  );
};

export default SamplesListContainer;
