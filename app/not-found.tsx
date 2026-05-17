import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center max-w-md w-full mx-4">
        <TriangleAlert className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h1 className="text-2xl font-semibold text-red-700">Page not found</h1>
        <p className="mt-2 text-sm text-red-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/samples"
          className="mt-5 inline-block rounded-md border border-red-300 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-100"
        >
          Back to samples
        </Link>
      </div>
    </div>
  )
}
