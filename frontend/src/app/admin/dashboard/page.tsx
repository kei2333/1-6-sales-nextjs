"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { WeeklyRevenueCard } from "@/components/dashboard/WeeklyRevenueCard";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { BranchTabs } from "@/components/dashboard/BranchTabs";
import { Card, CardContent } from "@/components/ui/card";
import { PieChartComponent } from "@/components/dashboard/PieChartComponent";
import { mockSalesData } from "./mockSalesData";
import { SortableTable } from "@/components/general/SortableTable";
import { ExportCsvButton } from "@/components/general/ExportCsvButton";
import { BranchSalesPieChart } from "@/components/dashboard/BranchSalesPieChart";
import { PeriodTotalCard } from "@/components/dashboard/PeriodTotalCard";

export default function SalesDashboard() {
  const [analysisType, setAnalysisType] = useState<
    "category" | "sales_channel" | "tactics"
  >("category");
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>(
    []
  );
  const [pieData, setPieData] = useState<{ label: string; value: number }[]>(
    []
  );
  const [branchPieData, setBranchPieData] = useState<
    { label: string; value: number }[]
  >([]);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true";
  const [lastMonthValue, setLastMonthValue] = useState(0);
  const [changePercentage, setChangePercentage] = useState<number | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: firstDayOfLastMonth, to: lastDayOfLastMonth };
  });
  const [totalInPeriod, setTotalInPeriod] = useState(0);
  const [thisWeekValue, setThisWeekValue] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState<number | undefined>(
    undefined
  );

  type SalesData = {
    sales_date: string;
    amount: number;
    location_id: string;
    employee_name: string;
    sales_channel: string;
    category: string;
    tactics: string;
    memo?: string | null;
  };

  useEffect(() => {
    const fetchLastMonthSales = async () => {
      try {
        const today = new Date();
        const lastMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const prevMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          1
        );
        const prevMonthEnd = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          0
        );

        const createParams = (from: Date, to: Date) => {
          const params = new URLSearchParams();
          params.set("sales_date_from", from.toISOString().split("T")[0]);
          params.set("sales_date_until", to.toISOString().split("T")[0]);
          if (selectedBranch !== undefined) {
            params.set("location_id", selectedBranch);
          }
          return params.toString();
        };

        const fetchData = async (from: Date, to: Date) => {
          const query = createParams(from, to);
          const url = `/api/get-sales?${query}`;
          if (isMockMode) return mockSalesData || [];
          return fetch(url).then((res) => res.json());
        };

        const [lastMonthData, prevMonthData] = await Promise.all([
          fetchData(lastMonthStart, lastMonthEnd),
          fetchData(prevMonthStart, prevMonthEnd),
        ]);

        const sum = (arr: any[]) =>
          arr.reduce((acc, item) => acc + (item.amount || 0), 0);

        const lastTotal = sum(lastMonthData);
        const prevTotal = sum(prevMonthData);

        setLastMonthValue(lastTotal);
        if (prevTotal > 0) {
          const percent = ((lastTotal - prevTotal) / prevTotal) * 100;
          setChangePercentage(Number(percent.toFixed(1)));
        } else {
          setChangePercentage(undefined);
        }
      } catch (e) {
        console.error("❌ 先月 / 先々月売上取得エラー", e);
        setLastMonthValue(0);
        setChangePercentage(undefined);
      }
    };

    fetchLastMonthSales();
  }, [selectedBranch, isMockMode]);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setTotalInPeriod(0);
      return;
    }

    const total = salesData.reduce((sum, cur) => sum + (cur.amount || 0), 0);
    setTotalInPeriod(total);
  }, [salesData, dateRange]);

  // 今月の目標金額を取得（拠点 or 全拠点合算）
  useEffect(() => {
    const fetchTargetAmount = async () => {
      if (isMockMode) return;

      try {
        const url = `https://team6-sales-function-2.azurewebsites.net/api/get_sales_target`;
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} - ${text}`);
        }
        const data = await res.json();

        const now = new Date();
        const targetMonth = now.toISOString().slice(0, 7); // 例: 2025-05

        if (selectedBranch) {
          const matched = data.find(
            (d: any) =>
              d.target_date.startsWith(targetMonth) &&
              String(d.location_id) === selectedBranch
          );

          if (matched?.target_amount) {
            setTargetAmount(Number(matched.target_amount));
          } else {
            console.warn("⚠️ No match for branch. Marking as unset.");
            setTargetAmount(null);
          }
        } else {
          const total = data.reduce((acc: number, cur: any) => {
            const month = cur.target_date.slice(0, 7);
            if (month === targetMonth && cur.target_amount) {
              return acc + Number(cur.target_amount);
            }
            return acc;
          }, 0);
          setTargetAmount(total > 0 ? total : null);
        }
      } catch (e) {
        console.error("🚨 Failed to fetch target amount", e);
        setTargetAmount(null);
      }
    };

    fetchTargetAmount();
  }, [selectedBranch, isMockMode]);

  // 今月の売上合計を取得
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const fetchCurrentBranchSales = async () => {
      try {
        setError("");

        const params = new URLSearchParams();
        params.set("sales_date_from", startOfMonth.toISOString().split("T")[0]);
        params.set("sales_date_until", today.toISOString().split("T")[0]);

        if (selectedBranch !== undefined) {
          params.set("location_id", selectedBranch);
        }

        const url = `/api/get-sales?${params.toString()}`;
        const responseData = isMockMode
          ? mockSalesData
          : await fetch(url).then((res) => res.json());

        const total = responseData.reduce(
          (sum: number, cur: any) => sum + (cur.amount || 0),
          0
        );
        setCurrentAmount(total);
      } catch {
        setError("拠点の今月売上取得に失敗しました");
      }
    };

    fetchCurrentBranchSales();
  }, [selectedBranch, dateRange, isMockMode]);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to)
      return;

    const fetchAndGroupSales = async () => {
      try {
        setError("");

        if (!dateRange?.from || !dateRange?.to) {
          console.warn("❗日付範囲が未設定です");
          return;
        }

        const params = new URLSearchParams();
        params.set(
          "sales_date_from",
          dateRange.from.toISOString().split("T")[0]
        );
        params.set(
          "sales_date_until",
          dateRange.to.toISOString().split("T")[0]
        );

        const url = `/api/get-sales?${params.toString()}`;
        const responseData: SalesData[] = isMockMode
          ? mockSalesData
          : await fetch(url).then((res) => res.json());

        const grouped = responseData.reduce(
          (acc: Record<string, number>, cur: SalesData) => {
            const key = cur.location_id || "未設定";
            acc[key] = (acc[key] || 0) + cur.amount;
            return acc;
          },
          {}
        );

        const pie = Object.entries(grouped).map(([label, value]) => ({
          label,
          value: Number(value),
        }));

        setSalesData(responseData);
        setBranchPieData(pie);
      } catch (e) {
        setError("データの取得に失敗しました");
        console.error("❌ fetchAndGroupSales エラー:", e);
      }
    };

    fetchAndGroupSales();
  }, [dateRange, isMockMode]);

  const useFixedRevenueData = (
    selectedBranch?: string,
    isMockMode = false,
    mockSalesData?: any[],
    targetAmount = 1500000
  ) => {
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [weeklyRevenue, setWeeklyRevenue] = useState(0);
    const [achievementRate, setAchievementRate] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchFixedRevenueData = async () => {
        try {
          setError("");
          const today = new Date();

          const currentMonthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );

          const lastMonthStart = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
          );
          const lastMonthEnd = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
          );

          const currentWeekDay = today.getDay() || 7;
          const lastWeekEnd = new Date(today);
          lastWeekEnd.setDate(today.getDate() - currentWeekDay);
          const lastWeekStart = new Date(lastWeekEnd);
          lastWeekStart.setDate(lastWeekEnd.getDate() - 6);

          const createParams = (from: Date, to: Date) => {
            const params = new URLSearchParams();
            params.set("sales_date_from", from.toISOString().split("T")[0]);
            params.set("sales_date_until", to.toISOString().split("T")[0]);
            if (selectedBranch !== undefined) {
              params.set("location_id", selectedBranch);
            }
            return params.toString();
          };

          const fetchData = async (from: Date, to: Date) => {
            const query = createParams(from, to);
            const url = `/api/get-sales?${query}`;
            if (isMockMode) return mockSalesData || [];
            return fetch(url).then((res) => res.json());
          };

          const [monthlyData, weeklyData, currentMonthData] = await Promise.all(
            [
              fetchData(lastMonthStart, lastMonthEnd),
              fetchData(lastWeekStart, lastWeekEnd),
              fetchData(currentMonthStart, today),
            ]
          );

          const sum = (arr: any[]) =>
            arr.reduce((acc, item) => acc + (item.amount || 0), 0);

          setMonthlyRevenue(sum(monthlyData));
          setWeeklyRevenue(sum(weeklyData));
          setAchievementRate(sum(currentMonthData) / targetAmount);
        } catch (e) {
          setError("売上データの取得に失敗しました");
        }
      };

      fetchFixedRevenueData();
    }, [selectedBranch, isMockMode, mockSalesData, targetAmount]);

    return {
      monthlyRevenue,
      weeklyRevenue,
      achievementRate,
      error,
    };
  };

  const { weeklyRevenue, achievementRate } = useFixedRevenueData(
    selectedBranch,
    isMockMode,
    mockSalesData,
    targetAmount ?? undefined
  );

  useEffect(() => {
    const fetchSales = async () => {
      if (!dateRange?.from || !dateRange?.to) {
        console.warn("日付が未設定のため、処理をスキップします");
        return;
      }
      try {
        const params = new URLSearchParams();
        params.set(
          "sales_date_from",
          dateRange.from.toISOString().split("T")[0]
        );
        params.set(
          "sales_date_until",
          dateRange.to.toISOString().split("T")[0]
        );

        const url = `/api/get-sales?${params.toString()}`;
        const responseData = isMockMode
          ? mockSalesData
          : await fetch(url).then((res) => res.json());

        setSalesData(responseData);
      } catch (error) {
        setError("データの取得に失敗しました");
      }
    };

    fetchSales();
  }, [dateRange, selectedBranch, isMockMode]);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to || dateRange.from === dateRange.to)
      return;

    const aggregated = salesData.reduce((acc: Record<string, number>, cur) => {
      const date = cur.sales_date;
      acc[date] = (acc[date] || 0) + cur.amount;
      return acc;
    }, {});

    const chart = Object.entries(aggregated).map(([date, value]) => ({
      date,
      value,
    }));

    chart.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setChartData(chart);
  }, [salesData, dateRange?.from, dateRange?.to]);

  useEffect(() => {
    const from = dateRange?.from;
    const to = dateRange?.to;
    if (!from || !to || from === to) return;

    const grouped = salesData.reduce((acc: Record<string, number>, cur) => {
      const key = cur[analysisType];
      acc[key] = (acc[key] || 0) + cur.amount;
      return acc;
    }, {});

    const pie = Object.entries(grouped).map(([label, value]) => ({
      label,
      value,
    }));

    setPieData(pie);
  }, [salesData, analysisType, dateRange?.from, dateRange?.to]);

  useEffect(() => {
    const fetchWeeklyComparison = async () => {
      try {
        const today = new Date();
        const dayOfWeek = today.getDay() || 7; // 日曜=7
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - dayOfWeek + 1); // 今週の月曜

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

        const createParams = (from: Date, to: Date) => {
          const params = new URLSearchParams();
          params.set("sales_date_from", from.toISOString().split("T")[0]);
          params.set("sales_date_until", to.toISOString().split("T")[0]);
          if (selectedBranch !== undefined) {
            params.set("location_id", selectedBranch);
          }
          return params.toString();
        };

        const fetchData = async (from: Date, to: Date) => {
          const query = createParams(from, to);
          const url = `/api/get-sales?${query}`;
          if (isMockMode) return mockSalesData || [];
          return fetch(url).then((res) => res.json());
        };

        const [thisWeekData, lastWeekData] = await Promise.all([
          fetchData(thisWeekStart, today),
          fetchData(lastWeekStart, lastWeekEnd),
        ]);

        const sum = (arr: any[]) =>
          arr.reduce((acc, item) => acc + (item.amount || 0), 0);

        const thisTotal = sum(thisWeekData);
        const lastTotal = sum(lastWeekData);

        setThisWeekValue(thisTotal);
        if (lastTotal > 0) {
          const percent = ((thisTotal - lastTotal) / lastTotal) * 100;
          setWeeklyChange(Number(percent.toFixed(1)));
        } else {
          setWeeklyChange(undefined);
        }
      } catch (e) {
        console.error("❌ 今週 / 前週売上取得エラー", e);
        setThisWeekValue(0);
        setWeeklyChange(undefined);
      }
    };

    fetchWeeklyComparison();
  }, [selectedBranch, isMockMode]);

  const columns = [
    { key: "employee_name", label: "従業員名" },
    { key: "category", label: "カテゴリ" },
    { key: "sales_channel", label: "チャネル" },
    { key: "tactics", label: "戦略" },
    {
      key: "amount",
      label: "売上",
      format: (v: number) => `\u00A5${v.toLocaleString()}`,
    },
    { key: "sales_date", label: "日付" },
    { key: "location_id", label: "支店ID" },
  ];

  return (
    <main className="flex flex-col gap-6 p-6 md:ml">
      {/* 拠点タブ + CSV出力 */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <BranchTabs value={selectedBranch} onValueChange={setSelectedBranch} />
        <ExportCsvButton data={salesData} filename="売上一覧.csv" />
      </div>

      {/* ✅ 幅制限を解除し、親と同じ幅・paddingで統一 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* カレンダー */}
        <Card className="w-full">
          <CardContent className="p-4">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
          </CardContent>
        </Card>

        {/* 選択期間の売上カード */}
        <div className="w-full flex items-center">
          <PeriodTotalCard
            amount={totalInPeriod}
            from={dateRange?.from}
            to={dateRange?.to}
          />
        </div>

        {/* 空の3列目：下段と揃えるためのスペース */}
        <div className="w-full" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCard
          value={lastMonthValue}
          changePercentage={changePercentage}
        />
        <WeeklyRevenueCard
          value={thisWeekValue}
          changePercentage={weeklyChange}
        />
        <AchievementCard
          currentAmount={currentAmount}
          percentage={achievementRate}
          target={targetAmount}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BranchSalesPieChart
          data={branchPieData}
          highlightLabel={selectedBranch}
        />
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
  );
}
