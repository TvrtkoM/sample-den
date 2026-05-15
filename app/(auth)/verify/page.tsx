import VerifyEmail from '@/components/auth/VerifyEmail'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function VerifyPage() {
  const cookieStore = await cookies()
  const signUpVerification = cookieStore.get('signUpVerification')

  if (!signUpVerification || signUpVerification.value !== 'true') {
    redirect('/samples')
  }

  return (
    <main className="container-small">
      <VerifyEmail />
    </main>
  )
}
