// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableTable } from "@/components/general/SortableTable";

// fetchするデータの型を定義
type SalesReport = {
  id: number;
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string|null;
  employee_number: number;
}

export default function AdminPage() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [, setError] = useState("");
  // 現在の日付を取得
  const now = new Date();
  const today_year = now.getFullYear();
  const today_month = now.getMonth() + 1;
  const today_day = now.getDate();
  const location_id = 4;
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(`https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date=${today_year}-${today_month}-${today_day}&location_id=${location_id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // レスポンスのデータをjsonに変換
        const json = await res.json();
        setReports(json);
      } catch (err) {
        setError('データ取得に失敗しました');
        console.error("データ取得エラー:", err);
      }
    }
    fetchSales();
  }, []);
  return (
    <main className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">本日{today_year}年{today_month}月{today_day}日の売上報告</h2>

      {/* 大阪拠点 */}
      <Card>
        <CardHeader>
          <CardTitle>本日の近畿拠点の報告状況</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
              <p>データがありません。</p>
            ) : (
              <SortableTable
                data={reports}
                columns={[
                  { key: "employee_name", label: "報告者" },
                  { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
                  { key: "sales_channel", label: "チャネル"},
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
