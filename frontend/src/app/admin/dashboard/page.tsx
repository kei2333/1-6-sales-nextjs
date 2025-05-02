'use client'

import { RevenueCard } from "@/components/dashboard/RevenueCard"
import { WeeklyRevenueCard } from "@/components/dashboard/WeeklyRevenueCard"
import { AchievementCard } from "@/components/dashboard/AchievementCard"
import { Card, CardContent } from "@/components/ui/card"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { DateRangePicker } from "@/components/dashboard/DateRangePicker"
import { BranchTabs } from "@/components/dashboard/BranchTabs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PieChartComponent } from "@/components/dashboard/PieChartComponent"
import { useEffect } from "react"

export default function SalesDashboard() {
    const [analysisType, setAnalysisType] = useState<"category" | "channel" | "strategy">("category")

    const [selectedBranch, setSelectedBranch] = useState("all")
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
    const [salesData, setSalesData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    
    useEffect(() => {
        const fetchSales = async () => {
          setIsLoading(true)
          setError("")
    
          const params = new URLSearchParams({
            sales_date_from: startDate,
            sales_date_until: endDate,
          })
    
          const url = `/api/get-sales?${params.toString()}`
          console.log("🔍 Fetching sales data from:", url)
    
          try {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
    
            const data = await res.json()
            console.log("✅ Fetched sales data:", data)
            setSalesData(data)
          } catch (err) {
            console.error("❌ Error:", err)
            setError("売上データの取得に失敗しました")
          } finally {
            setIsLoading(false)
          }
        }
    
        fetchSales()
      }, [startDate, endDate])
    
    
    return (
        <main className="flex flex-col gap-6 p-6 md:ml">
            <BranchTabs value={selectedBranch} onValueChange={setSelectedBranch} />
            {/* 売上カード 3つ */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RevenueCard />
                <WeeklyRevenueCard />
                <AchievementCard />

            </section>

            {/* 折れ線グラフ */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <SalesChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <PieChartComponent data={salesData} analysisType={analysisType} />
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardContent className="p-4">
                        <DateRangePicker />
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant={analysisType === "category" ? "default" : "outline"}
                                onClick={() => setAnalysisType("category")}
                            >
                                商品カテゴリ
                            </Button>
                            <Button
                                variant={analysisType === "channel" ? "default" : "outline"}
                                onClick={() => setAnalysisType("channel")}
                            >
                                チャネル
                            </Button>
                            <Button
                                variant={analysisType === "strategy" ? "default" : "outline"}
                                onClick={() => setAnalysisType("strategy")}
                            >
                                戦略
                            </Button>
                        </div>

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
                                <tbody>
                                    {salesData.map((sale, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2">{sale.task}</td>
                                            <td className="p-2">{sale.name}</td>
                                            <td className="p-2">{sale.category}</td>
                                            <td className="p-2">¥{sale.amount.toLocaleString()}</td>
                                            <td className="p-2">{sale.date}</td>
                                            <td className="p-2">{sale.branch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
