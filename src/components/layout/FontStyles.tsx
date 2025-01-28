'use client'

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
})

export default function FontStyles() {
  return (
    <style jsx global>{`
      .font-montserrat {
        font-family: ${montserrat.style.fontFamily};
      }
    `}</style>
  )
}
