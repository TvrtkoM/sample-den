import TopMessages from '@/components/TopMessages'
import AppProvider from '@/components/providers/AppProvider'
import { getSession } from '@/lib/getSession'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Sample Den',
    template: 'Sample Den | %s',
  },
  description: 'All the wierd audio you could wish for',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionPromise = getSession()
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider sessionPromise={sessionPromise}>
          <TopMessages />
          <Toaster position="top-right" />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
