'use client'

import ForgotPasswordDialog from '@/components/auth/ForgotPasswordDialog'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSession } from '@/hooks/use-session'
import { signIn } from '@/lib/auth-client'
import { emailRegex } from '@/lib/constants'
import { getAnonymousUserIdCookie } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import ErrorState from '../error/ErrorState'

type FormData = {
  email: string
  password: string
}

function SignInFormImpl() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { session } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const submit: SubmitHandler<FormData> = async (data) => {
    setAuthError(null)
    setIsSubmitting(true)

    const { email, password } = data

    if (session?.user.isAnonymous) {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = getAnonymousUserIdCookie(session.user.id)
    }

    const res = await signIn.email({
      email,
      password,
    })

    if (res.error) {
      setIsSubmitting(false)
      setAuthError(res.error.message ?? 'Something went wrong')
    } else {
      // page reloads automatically from within ReloadOnAuthAction component
      // PublicGuard auto-redirects to store page
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className="card-shadow-sm p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: emailRegex,
                  message: 'Enter a valid email address',
                },
              })}
              placeholder="Email"
              type="email"
              autoComplete="off"
              id="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...register('password', {
                required: 'Password is required',
              })}
              type="password"
              placeholder="Password"
              autoComplete="off"
              id="password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>
          {authError && <ErrorState title={authError} className="p-4" />}
          <Field orientation="horizontal">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Sign In
            </Button>
            <Button
              type="button"
              variant="link"
              className="ml-auto self-end p-0 h-auto cursor-pointer"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot password?
            </Button>
          </Field>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <GoogleSignInButton />
        </FieldGroup>
      </form>
      <ForgotPasswordDialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </>
  )
}

/**
 * Email/password sign-in form with Google OAuth as a secondary option.
 * Re-mounts on pathname changes (via `key`) to reset form state when navigating
 * between auth pages.
 */
export default function SignInForm() {
  const pathname = usePathname()

  return <SignInFormImpl key={pathname} />
}
