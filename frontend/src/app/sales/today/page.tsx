"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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

export default function SalesReportPage() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [, setError] = useState("");
  // 現在の日付を取得
  const now = new Date();
  const today_year = now.getFullYear();
  const today_month = now.getMonth() + 1;
  const today_day = now.getDate();
  // useEffectを使ってページ読み込み時にデータを取得
  // TODO: ユーザーのデータを取得し、ユーザーの所属する拠点に一致するデータを取得
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(`https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date=${today_year}-${today_month}-${today_day}&location_id=1`);
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
    <main className="flex-1 p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-muted-foreground">今日の売上報告</h2>
        <div className="flex items-center gap-4">
          <span>田中さん</span>
          <Button variant="outline">ログアウト</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>今日の関東拠点の報告状況</CardTitle>
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
                { key: "memo1", label: "メモ" },
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* User Sales History */}
      {/* TODO: ユーザーのデータを取得し、ユーザーの所属する拠点とemployee_idに一致するデータを取得 */}
      <Card>
        <CardHeader>
          <CardTitle>今日のあなたの報告履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {/*filterするemployee_numberを現在のユーザーのものに一致させる*/}
          {reports.filter((r) => r.employee_number ===1).length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <SortableTable
              data={reports.filter((r) => r.employee_number ===1)}
              columns={[
                { key: "employee_name", label: "報告者" },
                { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
                { key: "sales_channel", label: "チャネル"},
                { key: "category", label: "商品カテゴリ" },
                { key: "tactics", label: "種別" },
                { key: "memo1", label: "メモ" },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}