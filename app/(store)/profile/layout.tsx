import PrivateGuard from '@/components/auth/PrivateGuard'
import ProfileNav from '@/components/profile/ProfileNav'
import { ReactNode } from 'react'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateGuard>
      <ProfileNav />
      {children}
    </PrivateGuard>
  )
}
