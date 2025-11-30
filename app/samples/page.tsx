import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { fetchSamplesPage } from "@/lib/fetch";
import {
  getDehydratedState,
  getServerQueryClient
} from "@/lib/react-query-server";
import { loadSamplesSearchParams } from "@/lib/search-params";
import { HydrationBoundary } from "@tanstack/react-query";

type SearchParams = {
  page?: string;
  search?: string;
};

export default async function SamplesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = getServerQueryClient();

  const params = await loadSamplesSearchParams(searchParams);

  await queryClient.prefetchQuery({
    queryKey: ["samples", params.search, params.page],
    queryFn: () => fetchSamplesPage(params.page, params.search)
  });

  const dehydrated = getDehydratedState(queryClient);

  return (
    <HydrationBoundary state={dehydrated}>
      <section aria-labelledby="samples-heading">
        <header className="border-b border-neutral-200">
          <div className="container py-6">
            <h1 className="mb-6" id="samples-heading">
              Sample den
            </h1>
            <SampleSearch />
          </div>
        </header>
        <SamplesList />
      </section>
    </HydrationBoundary>
  );
}
