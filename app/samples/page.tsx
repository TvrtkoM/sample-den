import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { SamplesPageDocument } from "@/graphql-generated/graphql";
import { defaultSamplesPageSize } from "@/lib/constants";
import { graphqlClient } from "@/lib/graphql-client";
import {
  getDehydratedState,
  getServerQueryClient
} from "@/lib/react-query-server";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function SamplesPage() {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["samples", 0],
    queryFn: () =>
      graphqlClient.request(SamplesPageDocument, {
        limit: defaultSamplesPageSize
      })
  });

  const dehydrated = getDehydratedState(queryClient);

  return (
    <HydrationBoundary state={dehydrated}>
      <header className="border-b border-neutral-200">
        <div className="container py-6">
          <h1 className="mb-6">Sample den</h1>
          <SampleSearch />
        </div>
      </header>
      <SamplesList />
    </HydrationBoundary>
  );
}
