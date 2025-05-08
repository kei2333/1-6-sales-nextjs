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
import { BranchSalesPieChart } from "@/components/dashboard/BranchSalesPieChart"

export default function SalesDashboard() {
  const [analysisType, setAnalysisType] = useState<"category" | "sales_channel" | "tactics">("category")
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(undefined);
  const [salesData, setSalesData] = useState<any[]>([])
  const [error, setError] = useState("")
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([])
  const [pieData, setPieData] = useState<{ label: string; value: number }[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date()
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0) // 0日指定で前月末

    return {
      from: firstDayOfLastMonth,
      to: lastDayOfLastMonth,
    }
  })
  const [currentAmount, setCurrentAmount] = useState(0)
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true"

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to) return

    const fetchCurrentBranchSales = async () => {
      try {
        setError("")
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const params = new URLSearchParams()
        params.set("sales_date_from", startOfMonth.toISOString().split("T")[0])
        params.set("sales_date_until", today.toISOString().split("T")[0])

        if (selectedBranch !== undefined) {
          params.set("location_id", selectedBranch)
        } // selectedBranch が undefined でない場合のみ追加

        const url = `/api/get-sales?${params.toString()}`
        console.log("📊 Fetching currentAmount for branch:", url)

        const responseData = isMockMode
          ? mockSalesData
          : await fetch(url).then(res => res.json())

        const total = responseData.reduce((sum: number, cur: any) => sum + (cur.amount || 0), 0)
        setCurrentAmount(total)
      } catch {
        setError("拠点の今月売上取得に失敗しました")
      }
    }

    fetchCurrentBranchSales()
  }, [selectedBranch, dateRange, isMockMode])



  const [branchPieData, setBranchPieData] = useState<{ label: string; value: number }[]>([])
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to) return;

    const fetchAndGroupSales = async () => {
      try {
        setError("")
        const params = new URLSearchParams()
        if (dateRange?.from) params.set("sales_date_from", dateRange.from.toISOString().split("T")[0])
        if (dateRange?.to) params.set("sales_date_until", dateRange.to.toISOString().split("T")[0])
        // location_id はここでは **追加しない**（全拠点取得のため）

        const url = `/api/get-sales?${params.toString()}`
        console.log("🔍 Fetching sales data (all branches):", url)
        console.log("Mock mode is", isMockMode ? "enabled" : "disabled")

        const responseData = isMockMode
          ? mockSalesData
          : await fetch(url).then(res => res.json())

        // 拠点ごとの売上集計
        const grouped = responseData.reduce((acc: Record<string, number>, cur: any) => {
          const key = cur.location_id || "未設定"
          acc[key] = (acc[key] || 0) + cur.amount
          return acc
        }, {})
        const pie = Object.entries(grouped).map(([label, value]) => ({
          label,
          value: Number(value),
        }))

        setSalesData(responseData)  // 必要に応じて
        setBranchPieData(pie)  // 拠点別売上データを更新
      } catch {
        setError("データの取得に失敗しました")
      }
    }

    fetchAndGroupSales()
  }, [dateRange, isMockMode])  // selectedBranch を削除



  const targetAmount = 1500000

  const useFixedRevenueData = (selectedBranch?: string, isMockMode = false, mockSalesData?: any[]) => {
    const [monthlyRevenue, setMonthlyRevenue] = useState(0)
    const [weeklyRevenue, setWeeklyRevenue] = useState(0)
    const [achievementRate, setAchievementRate] = useState(0)
    const [error, setError] = useState("")

    useEffect(() => {
      const fetchFixedRevenueData = async () => {
        try {
          setError("")

          // ✅ 日付定義
          const today = new Date()

          // 今月 1日〜今日
          const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

          // 先月 1日〜末日
          const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

          // 先週 月曜〜日曜
          const currentWeekDay = today.getDay() || 7 // Sunday = 7
          const lastWeekEnd = new Date(today)
          lastWeekEnd.setDate(today.getDate() - currentWeekDay)
          const lastWeekStart = new Date(lastWeekEnd)
          lastWeekStart.setDate(lastWeekEnd.getDate() - 6)

          // ✅ クエリ文字列生成
          const createParams = (from: Date, to: Date) => {
            const params = new URLSearchParams()
            params.set("sales_date_from", from.toISOString().split("T")[0])
            params.set("sales_date_until", to.toISOString().split("T")[0])
            if (selectedBranch !== undefined) {
              params.set("location_id", selectedBranch)
            }
            return params.toString()
          }

          // ✅ API 呼び出し
          const fetchData = async (from: Date, to: Date) => {
            const query = createParams(from, to)
            const url = `/api/get-sales?${query}`
            console.log("📡 Fetching:", url)
            if (isMockMode) return mockSalesData || []
            return fetch(url).then(res => res.json())
          }

          const [monthlyData, weeklyData, currentMonthData] = await Promise.all([
            fetchData(lastMonthStart, lastMonthEnd),
            fetchData(lastWeekStart, lastWeekEnd),
            fetchData(currentMonthStart, today),
          ])

          // ✅ 合計計算
          const sum = (arr: any[]) =>
            arr.reduce((acc, item) => acc + (item.amount || 0), 0)

          setMonthlyRevenue(sum(monthlyData))
          setWeeklyRevenue(sum(weeklyData))

          const currentMonthTotal = sum(currentMonthData)
          setAchievementRate(currentMonthTotal / targetAmount)
        } catch (e) {
          console.error("📛 Revenue fetch error", e)
          setError("売上データの取得に失敗しました")
        }
      }

      fetchFixedRevenueData()
    }, [selectedBranch, isMockMode, mockSalesData]) // ✅ 拠点やモックが変わったときに再取得

    return {
      monthlyRevenue,
      weeklyRevenue,
      achievementRate,
      error,
    }
  }
  const {
    monthlyRevenue,
    weeklyRevenue,
    achievementRate,

  } = useFixedRevenueData(selectedBranch, isMockMode, mockSalesData)

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to) return;
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
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to) return;
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
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to) return;
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
      <div className="mt-4 max-w-md">
        <Card>
          <CardContent className="p-4">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
          </CardContent>
        </Card>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCard value={monthlyRevenue} />
        <WeeklyRevenueCard value={weeklyRevenue} />
        <AchievementCard
          currentAmount={currentAmount}
          percentage={achievementRate}
          target={15000000}
        />
      </section>
      {/* グラフ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BranchSalesPieChart data={branchPieData} highlightLabel={selectedBranch} />
        <Card>
          <CardContent className="pt-6 pb-4 px-4 flex justify-center">
            <PieChartComponent
              data={pieData}
              analysisType={analysisType}
              onChangeAnalysisType={setAnalysisType}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <SalesChart data={chartData} />
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
