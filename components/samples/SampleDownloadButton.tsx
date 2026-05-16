'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const sampleActionButtonVariants = cva('w-full transition-all', {
  variants: {
    state: {
      buy: 'bg-primary text-primary-foreground hover:bg-primary/90',
      'in-cart': 'bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
      download: 'bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
    },
  },
  defaultVariants: {
    state: 'buy',
  },
})

type SampleDownloadButtonProps = { purchaseId: string | null; className?: string }

export default function SampleDownloadButton({ purchaseId, className }: SampleDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!purchaseId) return
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/library/download?purchaseId=${encodeURIComponent(purchaseId)}`)
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Could not prepare download')
        return
      }
      const { url } = (await res.json()) as { url: string }
      window.location.href = url
    } catch {
      toast.error('Could not prepare download')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      className={cn(
        'w-full transition-all bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
        className,
      )}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download /> {isDownloading ? 'Preparing...' : 'Download .wav'}
    </Button>
  )
}

export { sampleActionButtonVariants }
