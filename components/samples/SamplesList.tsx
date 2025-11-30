"use client";

import useSamplesPage from "@/hooks/queries/useSamplesPage";
import { defaultSamplesPageSize } from "@/lib/constants";
import { useSamplesSearchParams } from "@/lib/search-params";
import AppPagination from "../AppPagination";
import { Skeleton } from "../ui/skeleton";
import SampleItem from "./SampleItem";
import { useDebounce } from "@uidotdev/usehooks";

const SamplesList = () => {
  const [searchParams, setSearchParams] = useSamplesSearchParams();

  const debouncedParams = useDebounce(searchParams, 300);

  const search = debouncedParams.search;
  const pageNum = debouncedParams.page;

  const { data: pageData, isFetched: isPageFetched } = useSamplesPage(
    pageNum,
    search
  );

  const isFetched = isPageFetched;

  const samples = pageData?.samples ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const totalPages =
    totalCount === 0 ? 0 : Math.ceil(totalCount / defaultSamplesPageSize);

  const pageChangeHandler = (nextPage: number) => {
    setSearchParams({
      page: nextPage
    });
  };

  if (isFetched && samples.length == 0)
    return <h1 className="container py-8 sm:py-12">No samples found.</h1>;

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
      {totalPages > 0 && (
        <AppPagination
          pageNum={pageNum}
          totalPages={totalPages}
          onPageChange={pageChangeHandler}
          className="container"
        />
      )}
    </>
  );
};

export default SamplesList;
