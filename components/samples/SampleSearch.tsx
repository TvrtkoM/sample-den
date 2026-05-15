'use client'

import { useSamplesSearchParams } from '@/lib/search-params/hooks'
import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useDebouncedCallback } from '@mantine/hooks'
import { useState } from 'react'

const SampleSearch = () => {
  const [{ search }, setSearchParams] = useSamplesSearchParams()
  const [searchVal, setSearchVal] = useState(search)

  const debouncedSetSearch = useDebouncedCallback(
    (value: string) => setSearchParams({ search: value, page: null }),
    200,
  )

  return (
    <form className="flex gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-gray-400 left-3" />
        <Input
          type="text"
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value)
            debouncedSetSearch(e.target.value)
          }}
          placeholder="Search samples..."
          autoComplete="off"
          className="pl-10"
        />
      </div>
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          if (search) {
            setSearchVal('')
            setSearchParams(null)
          }
        }}
      >
        Clear
      </Button>
    </form>
  )
}

export default SampleSearch
