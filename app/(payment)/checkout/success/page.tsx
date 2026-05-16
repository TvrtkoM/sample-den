import { Button } from '@/components/ui/button'
import { stripe } from '@/lib/stripe/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Payment Successful' }

type Props = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect('/')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id)

  if (session.status !== 'complete') {
    redirect('/')
  }

  return (
    <main className="container-small">
      <h1 className="mb-8 mt-4">Payment Successful</h1>
      <div className="card-shadow-sm p-6">
        <p className="mb-4">Thank you for your purchase! Your samples are now available in your library.</p>
        <Button asChild>
          <Link href="/profile/library">Go to Library</Link>
        </Button>
      </div>
      <p className="mt-3">
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href="/samples">Buy more samples</Link>
        </Button>
      </p>
    </main>
  )
}
