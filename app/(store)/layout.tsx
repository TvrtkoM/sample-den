import AppNavButtons from '@/components/AppNavButtons'
import CartDrawer from '@/components/cart/CartDrawer'
import { getCartSamplesIds } from '@/lib/db'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ReactNode } from 'react'

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['cart'],
    queryFn: async () => ({ items: await getCartSamplesIds() }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="border-b border-neutral-200 mb-8">
        <div className="container py-6">
          <div className="flex justify-between">
            <h1 id="samples-heading">Sample Den</h1>
            <AppNavButtons />
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
      <CartDrawer />
    </HydrationBoundary>
  )
}
