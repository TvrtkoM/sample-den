"use client";

import useSamplesPage from "@/hooks/queries/useSamplesPage";
import SampleItem from "./SampleItem";
import AppPagination from "../AppPagination";
import { FC } from "react";
import { defaultSamplesPageSize } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type SamplesListProps = {
  pageNum: number;
  search: string;
};

const SamplesList: FC<SamplesListProps> = ({ pageNum, search }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: pageData, isFetched: isPageFetched } = useSamplesPage(
    pageNum,
    search
  );

  const isFetched = isPageFetched;

  const samples = pageData?.samples ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const totalPages =
    totalCount === 0 ? 0 : Math.ceil(totalCount / defaultSamplesPageSize);

  const pageChangeHandler = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`/samples?${params.toString()}`);
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
