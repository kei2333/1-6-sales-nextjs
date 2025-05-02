'use client'

import { Card, CardContent } from "@/components/ui/card"

export default function SalesDashboard() {
  return (
    <main className="flex flex-col gap-6 p-6 md:ml">
      {/* 売上カード 3つ */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="h-[100px]">売上（月次）</CardContent></Card>
        <Card><CardContent className="h-[100px]">売上（週次）</CardContent></Card>
        <Card><CardContent className="h-[100px]">目標達成度</CardContent></Card>
      </section>

      {/* 折れ線グラフ */}
      <section>
        <Card>
          <CardContent className="h-[300px] flex items-center justify-center text-muted">
            グラフエリア（後ほど Recharts 追加）
          </CardContent>
        </Card>
      </section>

      {/* テーブル + フィルター */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">売上一覧</h2>
          {/* ここに日付ピッカーや検索バーを追加予定 */}
        </div>
        <Card>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Task</th>
                    <th className="p-2">従業員名</th>
                    <th className="p-2">カテゴリ</th>
                    <th className="p-2">売上</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">支店名</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 仮の空行 */}
                  <tr>
                    <td className="p-2 text-muted">...</td>
                    <td className="p-2 text-muted">...</td>
                    <td className="p-2 text-muted">...</td>
                    <td className="p-2 text-muted">...</td>
                    <td className="p-2 text-muted">...</td>
                    <td className="p-2 text-muted">...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
