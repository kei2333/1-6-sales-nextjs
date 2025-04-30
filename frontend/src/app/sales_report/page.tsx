'use client'

import { useEffect, useState } from 'react'

type User = {
  name: string
  location: string
}

type Report = {
  id: number
  date: string
  amount: number
  category: string
  memo?: string
  user: string
}

export default function SalesReportPage() {
  const [user, setUser] = useState<User | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [memo, setMemo] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // ログインユーザー情報をlocalStorageから取得
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  // ユーザー情報が取れたら履歴取得
  useEffect(() => {
    if (!user) return

    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/sales_report?location=${user.location}`)
        const data = await res.json()
        setReports(data)
      } catch (e) {
        console.error('履歴の取得に失敗しました')
      }
    }

    fetchReports()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !user) return

    try {
      const res = await fetch('/api/sales_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          amount: Number(amount),
          category,
          memo,
          location: user.location,
          user: user.name,
        }),
      })

      if (res.ok) {
        const newReport: Report = await res.json()
        setReports((prev) => [newReport, ...prev])
        setAmount('')
        setCategory('')
        setMemo('')
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">ログイン情報を読み込み中...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2">売上報告</h2>
        <p className="mb-2 text-gray-700">担当者: {user.name}</p>
        <p className="mb-6 text-gray-700">拠点: {user.location}</p>

        <h3 className="text-lg font-semibold mb-2">これまでの報告</h3>
        <table className="w-full mb-6 text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">日付</th>
              <th className="p-2 border">金額</th>
              <th className="p-2 border">種別</th>
              <th className="p-2 border">メモ</th>
              <th className="p-2 border">担当者</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="p-2 border">{r.date}</td>
                <td className="p-2 border">¥{r.amount.toLocaleString()}</td>
                <td className="p-2 border">{r.category}</td>
                <td className="p-2 border">{r.memo || '-'}</td>
                <td className="p-2 border">{r.user}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">売上金額（円）</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min={0}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">売上種別</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">選択してください</option>
              <option value="EC">EC</option>
              <option value="エンド">エンド</option>
              <option value="法人">法人</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            提出する
          </button>

          {status === 'success' && (
            <p className="text-green-600 mt-4 text-center">提出が完了しました！</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 mt-4 text-center">提出に失敗しました</p>
          )}
        </form>
      </div>
    </div>
  )
}
