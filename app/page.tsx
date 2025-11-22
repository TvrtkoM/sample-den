import { HydrationBoundary } from "@tanstack/react-query";
import {
  getServerQueryClient,
  getDehydratedState
} from "@/lib/react-query-server";
import { graphqlClient } from "@/lib/graphql-client";
import { AllSamplesDocument } from "@/graphql-generated/graphql";
import SamplesList from "@/components/samples/SamplesList";

export default async function HomePage() {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["samples"],
    queryFn: () => graphqlClient.request(AllSamplesDocument)
  });

  const dehydrated = getDehydratedState(queryClient);

  return (
    <HydrationBoundary state={dehydrated}>
      <SamplesList />
    </HydrationBoundary>
  );
}
