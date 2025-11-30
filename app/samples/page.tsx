import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { fetchSamplesPage } from "@/lib/fetch";
import {
  getDehydratedState,
  getServerQueryClient
} from "@/lib/react-query-server";
import { HydrationBoundary } from "@tanstack/react-query";

type SearchParams = {
  page?: string;
};

export default async function SamplesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = getServerQueryClient();

  const pageNum = Number((await searchParams).page ?? "1");

  await queryClient.prefetchQuery({
    queryKey: ["samples", pageNum],
    queryFn: () => fetchSamplesPage(pageNum)
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
        <SamplesList pageNum={pageNum} />
      </section>
    </HydrationBoundary>
  );
}
