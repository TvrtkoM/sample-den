import 'server-only'
import { Resend } from 'resend'
import { ReactNode } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY!)

/**
 * Sends a transactional email via Resend from the default `noreply` address.
 * Logs the result or error to the console; does not throw on delivery failure.
 *
 * @param to - Recipient email address.
 * @param subject - Subject line of the email.
 * @param Email - React element that renders the email body.
 */
export async function sendEmail(to: string, subject: string, Email: ReactNode) {
  const { data, error } = await resend.emails.send({
    from: 'noreply@resend.dev',
    to,
    subject,
    react: Email,
  })
  if (error) {
    console.error(error.message)
    return
  }
  console.log('email sent', data)
}
