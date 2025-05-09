"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SortableTable } from "@/components/general/SortableTable";
import { Button } from "@/components/ui/button";

// fetchするデータの型を定義
type SalesReport = {
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string|null;
}

export default function AdminPage() {
  const {data: session, status} = useSession();
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const location_id = session?.user?.location_id ?? 1; 

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchSales() {
      try {
        let lastDayOfMonth = 30;
        if ([1, 3, 5, 7, 8, 10, 12].includes(selectedMonth)){
          lastDayOfMonth = 31;
        } else if (selectedMonth === 2) {
          lastDayOfMonth = selectedYear % 4 === 0 ? 29 : 28;
        }

        const res = await fetch(
          `https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date_from=${selectedYear}-${selectedMonth}-1&sales_date_until=${selectedYear}-${selectedMonth}-${lastDayOfMonth}&location_id=${location_id}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setReports(json);
      } catch (err) {
        console.error(err);
        setError("データ取得に失敗しました");
      }
    }

    fetchSales();
  }, [selectedMonth, selectedYear, location_id, status]);

  if (status === "loading"){
    return <p>読み込み中...</p>;
  }

  return (
    <main className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        {selectedYear}年{selectedMonth}月の
        {location_id == 1 ? '関東': 
        location_id == 2 ? '北陸' : 
        location_id == 3 ? '東海' : 
        location_id == 4 ? '近畿' : 
        location_id == 5 ? '中四国' : 
        location_id == 6 ? '九州' : ''}
        拠点の報告状況
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => setSelectedYear(selectedYear - 1)}>
          ＜ 前年
        </Button>
        {[...Array(12)].map((_, i) => (
          <Button
            key={i + 1}
            variant={selectedMonth === i + 1 ? "default" : "outline"}
            onClick={() => setSelectedMonth(i + 1)}
          >
            {i + 1}月
          </Button>
        ))}
        <Button onClick={() => setSelectedYear(selectedYear + 1)}>
          翌年 ＞
        </Button>
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <>
              <SortableTable
                data={reports}
                columns={[
                  { key: "sales_date", label: "日付" },
                  { key: "employee_name", label: "報告者" },
                  { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
                  { key: "sales_channel", label: "チャネル"},
                  { key: "category", label: "商品カテゴリ" },
                  { key: "tactics", label: "種別" },
                  { key: "memo", label: "メモ" },
                ]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
