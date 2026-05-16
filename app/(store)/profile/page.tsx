import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <section>
      <h2 className="mb-3">Welcome</h2>
      <p className="mb-4 text-sm text-muted-foreground">Your purchased samples are available in your library.</p>
      <Button asChild>
        <Link href="/profile/library">Go to Library</Link>
      </Button>
    </section>
  )
}
