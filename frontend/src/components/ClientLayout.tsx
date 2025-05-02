'use client'

import Providers from './Providers'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
