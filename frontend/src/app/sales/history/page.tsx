"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const LocationID = 2; // 拠点別フィルター用変数

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(
          "/api/get-sales?sales_date=2025-03-03&location_id=2"
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
  }, []);

  const filteredReports = reports.filter((r) => {
    const date = new Date(r.sales_date);
    return (
      date.getFullYear() === selectedYear &&
      date.getMonth() + 1 === selectedMonth
    );
  });

  return (
    <main className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        {selectedYear}年{selectedMonth}月の大阪拠点の報告状況
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
          ) : filteredReports.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead>報告者</TableHead>
                  <TableHead>売り上げ</TableHead>
                  <TableHead>チャネル</TableHead>
                  <TableHead>商品カテゴリ</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>メモ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.sales_date}</TableCell>
                    <TableCell>{r.time || "12:35"}</TableCell>
                    <TableCell>{r.reporter_name || "田中健太郎"}</TableCell>
                    <TableCell>{r.amount}円</TableCell>
                    <TableCell>{r.sales_channel}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.tactics}</TableCell>
                    <TableCell>メモ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
