'use client'

import { cn } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button'

/**
 * Props for {@link ErrorState}.
 */
type ErrorStateProps = {
  /** Heading text shown above the message. */
  title?: string
  /** Descriptive error message shown below the title. */
  message?: string
  /** When provided, renders a "Try again" button that calls this handler. */
  onRetry?: () => void
  /** Additional CSS classes to merge onto the container. */
  className?: string
}

/**
 * Reusable red error panel displayed when data fetching or rendering fails.
 * Shows a warning icon, optional title, optional message, and an optional retry button.
 */
export default function ErrorState({ title = 'Something went wrong', message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('rounded-lg border border-red-200 bg-red-50 p-6 text-center', className)}>
      <TriangleAlert className="mx-auto mb-3 h-8 w-8 text-red-500" />
      <p className="font-semibold text-red-700">{title}</p>
      {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  )
}
