'use client'
import { useDismissTopMessage, useTopMessages } from '@/lib/store/top-messages'
import { TopMessageData, TopMessageSeverity } from '@/lib/types'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const topMessageVariants = cva('h-6 flex items-center border-b', {
  variants: {
    severity: {
      error: 'bg-red-700 text-white border-red-800',
      warning: 'bg-yellow-400 text-yellow-900 border-yellow-600',
      info: 'bg-gray-400 text-white border-primary/70',
    } satisfies Record<TopMessageSeverity, string>,
  },
})

function TopMessage({ id, Content, severity, dismissOnNavigate }: TopMessageData & { id: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dismiss = useDismissTopMessage()

  const url = `${pathname}?${searchParams.toString()}`
  const lastUrl = useRef(url)

  useEffect(() => {
    if (url !== lastUrl.current) {
      dismiss(id)
      lastUrl.current = url
    }
  }, [url, dismissOnNavigate, id, dismiss])

  return (
    <div className={topMessageVariants({ severity })} aria-label={`top message id ${id}`}>
      <div className="container flex justify-between text-sm font-bold items-center">
        <div>{Content}</div>
        <div aria-label="dissmiss top message" onClick={() => dismiss(id)} className="cursor-pointer">
          <X />
        </div>
      </div>
    </div>
  )
}

export default function TopMessages() {
  const topMessages = useTopMessages()

  return Object.entries(topMessages).map(([id, data]) => {
    return <TopMessage key={id} {...data} id={id} />
  })
}
