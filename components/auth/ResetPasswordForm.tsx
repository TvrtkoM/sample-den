'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/lib/auth-client'
import { passwordRegex } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import ErrorState from '../error/ErrorState'

type FormData = {
  password: string
  repeatPassword: string
}

/**
 * Form for setting a new password after following a reset link.
 * Submits `newPassword` along with the token from the email and redirects to
 * sign-in on success.
 */
export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<FormData>({
    defaultValues: { password: '', repeatPassword: '' },
    mode: 'onChange',
  })

  const password = useWatch({ control, name: 'password' })

  const submit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    setAuthError(null)

    const res = await resetPassword({ newPassword: data.password, token })

    if (res.error) {
      setAuthError(res.error.message ?? 'Something went wrong')
      setIsSubmitting(false)
    } else {
      router.push('/sign-in')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="card-shadow-sm p-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: passwordRegex,
                message:
                  'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.',
              },
            })}
            type="password"
            placeholder="New password"
            autoComplete="off"
            id="password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="repeatPassword">Repeat password</FieldLabel>
          <Input
            {...register('repeatPassword', {
              required: 'Please repeat your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            type="password"
            placeholder="Repeat password"
            autoComplete="off"
            id="repeatPassword"
            aria-invalid={Boolean(errors.repeatPassword)}
          />
          {errors.repeatPassword && <FieldError>{errors.repeatPassword.message}</FieldError>}
        </Field>

        {authError && <ErrorState title={authError} className="p-4" />}

        <Field orientation="horizontal">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Reset password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
