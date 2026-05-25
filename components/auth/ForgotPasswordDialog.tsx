'use client'

import ErrorState from '@/components/error/ErrorState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { requestPasswordReset } from '@/lib/auth-client'
import { emailRegex } from '@/lib/constants'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type FormData = {
  email: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const successMessage = "If an account with that email exists, we've sent a reset link."

/**
 * Dialog that lets a signed-out user request a password reset email.
 * Controlled by the parent via `open` / `onOpenChange`; submits via
 * `requestPasswordReset`. On success replaces the form with a confirmation
 * message and an `OK` button; on error surfaces the message inline.
 */
export default function ForgotPasswordDialog({ open, onOpenChange }: Props) {
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(() => false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const submit: SubmitHandler<FormData> = async (data) => {
    setAuthError(null)

    const res = await requestPasswordReset({
      email: data.email,
      redirectTo: '/reset-password',
    })

    if (res.error) {
      setAuthError(res.error.message ?? 'Something went wrong')
    } else {
      setSubmitted(true)
    }
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      setAuthError(null)
      reset()
      setTimeout(() => {
        setSubmitted(false)
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{submitted ? 'Check your email' : 'Reset your password'}</DialogTitle>
          <DialogDescription>
            {submitted
              ? ''
              : "Enter the email associated with your account and we'll send you a link to reset your password."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <>
            <p>{successMessage}</p>
            <Field orientation="horizontal">
              <Button type="button" className="cursor-pointer" onClick={() => handleOpenChange(false)}>
                OK
              </Button>
            </Field>
          </>
        ) : (
          <form onSubmit={handleSubmit(submit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
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
                  id="reset-email"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              {authError && <ErrorState title={authError} className="p-4" />}

              <Field orientation="horizontal">
                <Button type="submit" className="cursor-pointer" disabled={!isValid || isSubmitting}>
                  Send reset link
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
