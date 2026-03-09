import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Croplytics - AI-Powered Crop Disease Detection',
  description: 'Detect crop diseases, forecast yields, and calculate carbon footprint with AI-powered analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
