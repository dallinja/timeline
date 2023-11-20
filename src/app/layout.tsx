import type { Metadata } from 'next'
import { GeistSans, GeistMono } from 'geist/font'
import './globals.css'
import { cn } from '@/lib/cn'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'A timeline chart to plan for your future financial life.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
          // fontSans.variable,
          // inter.className,
        )}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
