// src/app/admin/layout.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { label: '売上レポート一覧', path: '/admin' },
    { label: '拠点別サマリ', path: '/admin/summary' },
    { label: 'ユーザー管理', path: '/admin/users' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">管理メニュー</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  )
}
