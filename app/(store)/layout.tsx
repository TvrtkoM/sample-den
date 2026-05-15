import AppNavButtons from '@/components/AppNavButtons'
import CartDrawer from '@/components/cart/CartDrawer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { getSession } from '@/lib/getSession'
import { ReactNode } from 'react'

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const sessionPromise = getSession()

  return (
    <SessionProvider sessionPromise={sessionPromise}>
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
    </SessionProvider>
  )
}
