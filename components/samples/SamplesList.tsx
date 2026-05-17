'use client'

import { SamplesPageQueryResult } from '@/generated/groq/sanity-types'
import { usePurchases } from '@/hooks/use-purchases'
import { useSamplesPage } from '@/hooks/use-samples'
import { defaultSamplesPageSize } from '@/lib/constants'
import { useSamplesSearchParams } from '@/lib/search-params/hooks'
import AppPagination from '../AppPagination'
import ErrorState from '../error/ErrorState'
import { GridContainer } from '../ui/grid-container'
import { Skeleton } from '../ui/skeleton'
import SampleItem from './SampleItem'

const SamplesList = ({ samples }: { samples: SamplesPageQueryResult['samples'][number][] }) => {
  const sampleIds = samples.map((s) => s._id)
  const { data } = usePurchases(sampleIds)

  if (samples.length === 0) {
    return <h1 className="container py-8 sm:py-12">No samples found.</h1>
  }
  return (
    <GridContainer className="py-8 sm:py-12">
      {samples.map((sample) => (
        <SampleItem key={sample._id} sample={sample} purchaseId={data?.purchases[sample._id] ?? null} />
      ))}
    </GridContainer>
  )
}

const SamplesSkeleton = () => {
  return (
    <GridContainer className="py-8 sm:py-12">
      {Array.from({ length: defaultSamplesPageSize }, (_, i) => (
        <Skeleton key={i} className="w-full h-64" />
      ))}
    </GridContainer>
  )
}

const SamplesListContainer = () => {
  const [searchParams, setSearchParams] = useSamplesSearchParams()
  const { search, page } = searchParams
  const {
    data: { samples, totalCount } = { totalCount: 0, samples: [] },
    isFetching,
    isError,
    refetch,
  } = useSamplesPage(page, search)

  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / defaultSamplesPageSize)

  const onPageChange = (nextPage: number) => {
    setSearchParams(
      {
        page: nextPage,
      },
      { history: 'push' },
    )
  }

  return (
    <>
      {isError && !isFetching ? (
        <ErrorState
          title="Failed to load samples"
          message="There was a problem loading the samples. Please try again."
          onRetry={() => refetch()}
          className="container my-8"
        />
      ) : isFetching ? (
        <SamplesSkeleton />
      ) : (
        <SamplesList samples={samples} />
      )}
      {totalPages > 0 && (
        <AppPagination
          buildHref={(page) => `/samples?page=${page}${search ? `&search=${search}` : ''}`}
          pageNum={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

/**
 * Top-level container for the samples listing page.
 * Reads `page` and `search` from the URL, fetches the matching samples, and
 * renders either a skeleton grid while loading or the paginated sample cards.
 */
export default SamplesListContainer
