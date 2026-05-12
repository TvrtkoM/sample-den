import AppNavButtons from "@/components/AppNavButtons";
import { ClearSignUpVerificationCookie } from "@/components/auth/ClearSignUpVerificationCookie";
import VerificationErrorToast from "@/components/auth/VerificationErrorToast";
import CartDrawer from "@/components/cart/CartDrawer";
import SampleSearch from "@/components/samples/SampleSearch";
import SamplesList from "@/components/samples/SamplesList";
import { getCartSamplesIds } from "@/lib/db";
import { fetchSamplesPage } from "@/lib/fetch/samples";
import { getQueryClient } from "@/lib/get-query-client";
import { loadSamplesSearchParams } from "@/lib/search-params/loaders";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cacheLife } from "next/cache";

type SearchParams = {
  page?: string;
  search?: string;
};

async function fetchSamplesPageCached(page: number, search: string) {
  "use cache";
  cacheLife("hours");

  return fetchSamplesPage(page, search);
}

async function PageImpl({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { page, search } = loadSamplesSearchParams(params);

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["samples", search, page],
      queryFn: () => fetchSamplesPageCached(page, search)
    }),
    queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: async () => ({ items: await getCartSamplesIds() })
    })
  ]);

  const dehydrated = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrated}>
      <ClearSignUpVerificationCookie />
      <VerificationErrorToast />
      <main>
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
      </main>
      <CartDrawer />
    </HydrationBoundary>
  );
}

export default async function SamplesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  return <PageImpl searchParams={searchParams} />;
}
