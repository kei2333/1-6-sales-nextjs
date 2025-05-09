"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { SortableTable } from "@/components/general/SortableTable";

// データ型定義
type SalesReport = {
  id: number;
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string | null;
  employee_number: number;
};

export default function SalesReportPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [error, setError] = useState<string>("");

  const now = new Date();
  const today_year = now.getFullYear();
  const today_month = now.getMonth() + 1;
  const today_day = now.getDate();

  useEffect(() => {
    async function fetchSales() {
      if (!session?.user) return;

      const location_id = session.user.location_id;
      try {
        const res = await fetch(
          `https://team6-sales-function-2.azurewebsites.net/api/get_sales?sales_date=${today_year}-${today_month}-${today_day}&location_id=${location_id}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setReports(json);
      } catch (err) {
        setError("データ取得に失敗しました");
        console.error("データ取得エラー:", err);
      }
    }

    fetchSales();
  }, [session, today_year, today_month, today_day]);

  if (status === "loading") {
    return <p>読み込み中...</p>;
  }

  if (!session?.user) {
    return <p>ログインが必要です。</p>;
  }

  const location_id = session.user.location_id;
  const employee_number = session.user.employee_number;

  const locationName =
    location_id === 1 ? "関東" :
    location_id === 2 ? "北陸" :
    location_id === 3 ? "東海" :
    location_id === 4 ? "近畿" :
    location_id === 5 ? "中四国" :
    location_id === 6 ? "九州" : "不明";

  return (
    <main className="flex-1 p-6 space-y-8">
      {/* ページタイトル */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-muted-foreground">
          本日{today_year}年{today_month}月{today_day}日の売上報告
        </h2>
      </div>

      {/* 所属拠点の報告状況 */}
      <Card>
        <CardHeader>
          <CardTitle>本日の{locationName}拠点の報告状況</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {reports.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <SortableTable
              data={reports}
              columns={[
                { key: "employee_name", label: "報告者" },
                { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
                { key: "sales_channel", label: "チャネル" },
                { key: "category", label: "商品カテゴリ" },
                { key: "tactics", label: "種別" },
                { key: "memo", label: "メモ" },
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* 自分の報告履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>本日のあなたの報告履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.filter((r) => r.employee_number === employee_number).length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <SortableTable
              data={reports.filter((r) => r.employee_number === employee_number)}
              columns={[
                { key: "employee_name", label: "報告者" },
                { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
                { key: "sales_channel", label: "チャネル" },
                { key: "category", label: "商品カテゴリ" },
                { key: "tactics", label: "種別" },
                { key: "memo", label: "メモ" },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
