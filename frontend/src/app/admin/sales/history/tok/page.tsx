"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SortableTable } from "@/components/general/SortableTable";
import { ExportCsvButton } from "@/components/general/ExportCsvButton"; // ✅ 追加

type SalesReport = {
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string | null;
};

export default function OsakaMarchReport() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const location_id = 3;

  useEffect(() => {
    async function fetchSales() {
      try {
        let lastDayOfMonth = 30;
        if ([1, 3, 5, 7, 8, 10, 12].includes(selectedMonth)) {
          lastDayOfMonth = 31;
        } else if (selectedMonth === 2) {
          lastDayOfMonth = selectedYear % 4 === 0 ? 29 : 28;
        }

        const res = await fetch(
          `https://team6-sales-function-2.azurewebsites.net/api/get_sales?sales_date_from=${selectedYear}-${selectedMonth}-1&sales_date_until=${selectedYear}-${selectedMonth}-${lastDayOfMonth}&location_id=${location_id}`
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
  }, [selectedMonth, selectedYear]);

  return (
    <div className="p-6">
      <div className="text-xl font-semibold mb-4">
        {selectedYear}年{selectedMonth}月の東海拠点の報告状況
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        {/* 月・年切替 */}
        <div className="flex items-center gap-2">
          <Button onClick={() => setSelectedYear(selectedYear - 1)}>
            ＜ 前年
          </Button>
          {[...Array(12)].map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => setSelectedMonth(i + 1)}
              className={
                selectedMonth === i + 1
                  ? "bg-lime-400 text-black font-bold hover:bg-lime-500"
                  : "bg-white text-black border hover:bg-gray-100"
              }
            >
              {i + 1}月
            </Button>
          ))}
          <Button onClick={() => setSelectedYear(selectedYear + 1)}>
            翌年 ＞
          </Button>
        </div>

        {/* ✅ CSV出力 */}
        <ExportCsvButton
          data={reports}
          filename={`東海拠点_${selectedYear}年${selectedMonth}月.csv`}
        />
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <SortableTable
              data={reports}
              columns={[
                { key: "sales_date", label: "日付" },
                { key: "employee_name", label: "報告者" },
                {
                  key: "amount",
                  label: "売り上げ",
                  format: (v) => `¥${v.toLocaleString()}`,
                },
                { key: "sales_channel", label: "チャネル" },
                { key: "category", label: "商品カテゴリ" },
                { key: "tactics", label: "種別" },
                { key: "memo", label: "メモ" },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
