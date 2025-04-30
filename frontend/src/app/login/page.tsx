'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^\d{8}$/.test(employeeNumber)) {
      alert('社員番号は8桁の数字で入力してください')
      return
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeNumber, password }),
    })

    const data = await res.json()
    if (res.ok) {
        alert('ログイン成功')
      
        // ユーザー情報をlocalStorageに保存
        localStorage.setItem('user', JSON.stringify(data.user))
        if(data.user.authority === '管理者') {
          // 管理者ページに遷移
          router.push('/admin/')
        }
      else {
        // 遷移処理
        router.push('/sales_report')
      }
      }
     else {
      alert(data.message || 'ログイン失敗')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>

        <div className="mb-4">
          <input
            type="text"
            value={employeeNumber}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d{0,8}$/.test(value)) {
                setEmployeeNumber(value)
              }
            }}
            placeholder="社員番号（8桁）"
            className="w-full p-2 border border-gray-300 rounded"
            inputMode="numeric"
            maxLength={8}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          ログイン
        </button>
      </form>
    </div>
  )
}
