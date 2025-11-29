import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { fetchSamplePage } from "@/lib/fetch";
import {
  getDehydratedState,
  getServerQueryClient
} from "@/lib/react-query-server";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function SamplesPage() {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["samples", 1],
    queryFn: () => fetchSamplePage(1)
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
