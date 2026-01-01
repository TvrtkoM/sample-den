import "server-only";
import { Resend } from 'resend';
import { ReactNode } from "react";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, Email: ReactNode) {
  const { data, error } = await resend.emails.send({
    from: 'noreply@resend.dev',
    to,
    subject,
    react: Email
  })
  if (error) {
    console.error(error.message);
    return;
  }
  console.log('email sent', data);
}