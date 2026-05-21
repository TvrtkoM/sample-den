import { ClearSignUpVerificationCookie } from '@/components/auth/ClearSignUpVerificationCookie'
import VerificationMessageHandler from '@/components/auth/VerificationMessageHandler'
import SampleSearch from '@/components/samples/SampleSearch'
import SamplesList from '@/components/samples/SamplesList'
import { getPurchasesMap } from '@/lib/db'
import { fetchSamplesPage } from '@/lib/fetch/samples'
import { getQueryClient } from '@/lib/get-query-client'
import { loadSamplesSearchParams } from '@/lib/search-params/loaders'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

export const metadata: Metadata = { title: 'Samples' }

type SearchParams = {
  page?: string
  search?: string
}

async function fetchSamplesPageCached(page: number, search: string) {
  'use cache'
  cacheLife('hours')

  return fetchSamplesPage(page, search)
}

async function PageImpl({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { page, search } = loadSamplesSearchParams(params)

  const queryClient = getQueryClient()

  const samplesResult = await fetchSamplesPageCached(page, search)
  const sampleIds = samplesResult.samples.map((s) => s._id)
  const sortedIds = [...sampleIds].sort()

  queryClient.setQueryData(['samples', search, page], samplesResult)

  await queryClient.prefetchQuery({
    queryKey: ['purchases', sortedIds],
    queryFn: async () => ({ purchases: await getPurchasesMap(sampleIds) }),
  })

  const dehydrated = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydrated}>
      <ClearSignUpVerificationCookie />
      <VerificationMessageHandler />
      <SampleSearch />
      <SamplesList />
    </HydrationBoundary>
  )
}

export default async function SamplesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <PageImpl searchParams={searchParams} />
}
