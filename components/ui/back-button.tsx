'use client'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'
import { parseAsString, useQueryState } from 'nuqs'

export function BackButton() {
  const [backUrl] = useQueryState('backUrl', parseAsString.withDefault(''))

  return (
    <Button variant={'link'} asChild>
      <Link href={backUrl || '/samples'} className="flex items-center">
        <ChevronLeft /> Go back
      </Link>
    </Button>
  )
}
