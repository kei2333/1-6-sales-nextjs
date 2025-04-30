'use client'

import { useEffect, useState } from 'react'

type Report = {
  id: number
  location: string
  amount: number
}

type Summary = {
  location: string
  total: number
  count: number
  average: number
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<Summary[]>([])

  useEffect(() => {
    const fetchAndSummarize = async () => {
      try {
        const res = await fetch('/api/sales_report')
        const reports: Report[] = await res.json()

        const grouped = new Map<string, { total: number; count: number }>()

        for (const r of reports) {
          const prev = grouped.get(r.location) || { total: 0, count: 0 }
          grouped.set(r.location, {
            total: prev.total + r.amount,
            count: prev.count + 1,
          })
        }

        const summaryArray: Summary[] = Array.from(grouped.entries()).map(
          ([location, { total, count }]) => ({
            location,
            total,
            count,
            average: Math.round(total / count),
          })
        )

        setSummary(summaryArray)
      } catch (e) {
        console.error('サマリ取得失敗', e)
      }
    }

    fetchAndSummarize()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">拠点別売上サマリ</h1>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">拠点名</th>
              <th className="p-2 border">売上合計</th>
              <th className="p-2 border">報告件数</th>
              <th className="p-2 border">平均売上</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s) => (
              <tr key={s.location}>
                <td className="p-2 border">{s.location}</td>
                <td className="p-2 border">¥{s.total.toLocaleString()}</td>
                <td className="p-2 border">{s.count} 件</td>
                <td className="p-2 border">¥{s.average.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
