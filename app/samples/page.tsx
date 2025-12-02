import CartIcon from "@/components/cart/CartIcon";
import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { fetchSamplesPage } from "@/lib/fetch";
import { loadSamplesSearchParams } from "@/lib/search-params";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";

type SearchParams = {
  page?: string;
  search?: string;
};

export default async function SamplesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = new QueryClient();

  const params = await loadSamplesSearchParams(searchParams);

  await queryClient.prefetchQuery({
    queryKey: ["samples", params.search, params.page],
    queryFn: () => fetchSamplesPage(params.page, params.search)
  });

  const dehydrated = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrated}>
      <section aria-labelledby="samples-heading">
        <header className="border-b border-neutral-200">
          <div className="container py-6">
            <div className="flex justify-between">
              <h1 className="mb-6" id="samples-heading">
                Sample den
              </h1>
              <nav>
                <CartIcon />
              </nav>
            </div>
            <SampleSearch />
          </div>
        </header>
        <SamplesList />
      </section>
    </HydrationBoundary>
  );
}
