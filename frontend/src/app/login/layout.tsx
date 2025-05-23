import './globals.css'
import { ReactNode } from 'react'
import Providers from '@/components/Providers' 

export const metadata = {
  title: 'My App',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
        <Providers>{children}</Providers>
  )
}