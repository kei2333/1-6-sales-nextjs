'use client'

import { useEffect, useState } from 'react'

type User = {
  id: number
  employeeNumber: string
  name: string
  location: string
  role: '一般' | '管理者'
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error('ユーザーの取得に失敗しました')
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">ユーザー管理</h1>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">社員番号</th>
              <th className="p-2 border">名前</th>
              <th className="p-2 border">拠点</th>
              <th className="p-2 border">権限</th>
              {/* 将来的に編集・削除ボタン */}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.employeeNumber}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.location}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
