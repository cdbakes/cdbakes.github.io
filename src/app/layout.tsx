import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Colin Baker',
  description: 'Personal website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark:bg-gray-900 dark:text-white" suppressHydrationWarning>
      <body className={`${inter.className} ${montserrat.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col ${montserrat.className} antialiased`}>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
