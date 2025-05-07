'use client'

import { RevenueCard } from "@/components/dashboard/RevenueCard"
import { WeeklyRevenueCard } from "@/components/dashboard/WeeklyRevenueCard"
import { AchievementCard } from "@/components/dashboard/AchievementCard"
import { Card, CardContent } from "@/components/ui/card"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { DateRangePicker } from "@/components/dashboard/DateRangePicker"
import { BranchTabs } from "@/components/dashboard/BranchTabs"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PieChartComponent } from "@/components/dashboard/PieChartComponent"
import { DateRange } from "react-day-picker"
import { mockSalesData } from "./mockSalesData"
import { SortableTable } from "@/components/general/SortableTable" // ← 追加
import { ExportCsvButton } from "@/components/general/ExportCsvButton" // ← 追加

export default function SalesDashboard() {
  const [analysisType, setAnalysisType] = useState<"category" | "sales_channel" | "tactics">("category")
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(undefined);
  const [salesData, setSalesData] = useState<any[]>([])
  const [error, setError] = useState("")
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([])
  const [pieData, setPieData] = useState<{ label: string; value: number }[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true"

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setError("")
        const params = new URLSearchParams()
        if (dateRange?.from) params.set("sales_date_from", dateRange.from.toISOString().split("T")[0])
        if (dateRange?.to) params.set("sales_date_until", dateRange.to.toISOString().split("T")[0])
          if (selectedBranch !== undefined) params.set("location_id", selectedBranch)

        const url = `/api/get-sales?${params.toString()}`
        console.log("🔍 Fetching sales data:", url)
        console.log("Mock mode is", isMockMode ? "enabled" : "disabled")

        const responseData = isMockMode
          ? mockSalesData
          : await fetch(url).then(res => res.json())

        setSalesData(responseData)
      } catch {
        setError("データの取得に失敗しました")
      }
    }

    fetchSales()
  }, [dateRange, selectedBranch, isMockMode])

  useEffect(() => {
    const aggregated = salesData.reduce((acc: Record<string, number>, cur) => {
      const date = cur.sales_date
      acc[date] = (acc[date] || 0) + cur.amount
      return acc
    }, {})

    const chart = Object.entries(aggregated).map(([date, value]) => ({ date, value }))
    chart.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setChartData(chart)
  }, [salesData])

  useEffect(() => {
    const grouped = salesData.reduce((acc: Record<string, number>, cur) => {
      const key = cur[analysisType]
      acc[key] = (acc[key] || 0) + cur.amount
      return acc
    }, {})

    const pie = Object.entries(grouped).map(([label, value]) => ({ label, value }))
    setPieData(pie)
  }, [salesData, analysisType])

  // 🔽 テーブルのカラム定義
  const columns = [
    { key: "employee_name", label: "従業員名" },
    { key: "category", label: "カテゴリ" },
    { key: "sales_channel", label: "チャネル" },
    { key: "tactics", label: "戦略" },
    { key: "amount", label: "売上", format: (v: number) => `¥${v.toLocaleString()}` },
    { key: "sales_date", label: "日付" },
    { key: "location_id", label: "支店ID" },
  ]

  return (
    <main className="flex flex-col gap-6 p-6 md:ml">
      <BranchTabs value={selectedBranch} onValueChange={setSelectedBranch} />

      {/* 売上カード */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCard />
        <WeeklyRevenueCard />
        <AchievementCard />
      </section>

      {/* グラフ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <SalesChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4 px-4 flex justify-center">
            <PieChartComponent data={pieData} analysisType={analysisType} />
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardContent className="p-4">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <div className="flex gap-2 mt-4">
              <Button variant={analysisType === "category" ? "default" : "outline"} onClick={() => setAnalysisType("category")}>
                商品カテゴリ
              </Button>
              <Button variant={analysisType === "sales_channel" ? "default" : "outline"} onClick={() => setAnalysisType("sales_channel")}>
                チャネル
              </Button>
              <Button variant={analysisType === "tactics" ? "default" : "outline"} onClick={() => setAnalysisType("tactics")}>
                戦略
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <ExportCsvButton data={salesData} filename={`sales_${selectedBranch}_${dateRange?.from?.toLocaleDateString()}_${dateRange?.to?.toLocaleDateString()}.csv`} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* テーブル */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">売上一覧</h2>
        </div>
        <Card>
          <CardContent>
            <div className="overflow-auto">
              <SortableTable data={salesData} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
