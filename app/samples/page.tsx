import AppNavButtons from "@/components/AppNavButtons";
import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { fetchSamplesPage } from "@/lib/fetch/samples";
import { loadSamplesSearchParams } from "@/lib/search-params";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

type SearchParams = {
  page?: string;
  search?: string;
};

async function getDehydratedState(searchParams: SearchParams) {
  "use cache";
  cacheLife("hours");

  const params = loadSamplesSearchParams(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["samples", params.search, params.page],
    queryFn: () => fetchSamplesPage(params.page, params.search)
  });

  const dehydrated = dehydrate(queryClient);

  return dehydrated;
}

async function PageImpl({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const dehydrated = await getDehydratedState(params);

  return (
    <HydrationBoundary state={dehydrated}>
      <section aria-labelledby="samples-heading">
        <header className="border-b border-neutral-200">
          <div className="container py-6">
            <div className="flex justify-between">
              <h1 className="mb-6" id="samples-heading">
                Sample den
              </h1>
              <AppNavButtons />
            </div>
            <SampleSearch />
          </div>
        </header>
        <SamplesList />
      </section>
    </HydrationBoundary>
  );
}

export default async function SamplesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense>
      <PageImpl searchParams={searchParams} />
    </Suspense>
  );
}
