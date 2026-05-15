'use client'

import { SamplesPageQueryResult } from '@/generated/groq/sanity-types'
import { useSamplesPage } from '@/hooks/use-samples'
import { defaultSamplesPageSize } from '@/lib/constants'
import { useSamplesSearchParams } from '@/lib/search-params/hooks'
import AppPagination from '../AppPagination'
import { Skeleton } from '../ui/skeleton'
import SampleItem from './SampleItem'

const SamplesList = ({ samples }: { samples: SamplesPageQueryResult['samples'][number][] }) => {
  if (samples.length === 0) {
    return <h1 className="container py-8 sm:py-12">No samples found.</h1>
  }
  return (
    <ul className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {samples.map((sample) => (
        <SampleItem key={sample._id} sample={sample} />
      ))}
    </ul>
  )
}

const SamplesSkeleton = () => {
  return (
    <div className="container py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: defaultSamplesPageSize }, (_, i) => (
        <Skeleton key={i} className="w-full h-64" />
      ))}
    </div>
  )
}

const SamplesListContainer = () => {
  const [searchParams, setSearchParams] = useSamplesSearchParams()
  const { search, page } = searchParams
  const { data: { samples, totalCount } = { totalCount: 0, samples: [] }, isFetching } = useSamplesPage(page, search)

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
      {isFetching ? <SamplesSkeleton /> : <SamplesList samples={samples} />}
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

export default SamplesListContainer
