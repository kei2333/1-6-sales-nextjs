"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useState, useEffect } from "react";

type SalesReport = {
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
}

export default function SalesReportPage() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(`https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date=2025-03-02&location_id=1`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setReports(json);
        console.log(json);
      } catch (err) {
        console.error(err);
        setError('データ取得に失敗しました');
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

      {/* Osaka Sales Table */}
      <Card>
  <CardHeader>
    <CardTitle>今日の大阪拠点の報告状況</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>報告者</TableHead>
          <TableHead>時間</TableHead>
          <TableHead>売り上げ</TableHead>
          <TableHead>チャネル</TableHead>
          <TableHead>商品カテゴリ</TableHead>
          <TableHead>種別</TableHead>
          <TableHead>メモ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { reports.length > 0 ? (
          reports.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.sales_date}</TableCell>
              <TableCell>{row.amount}円</TableCell>
              <TableCell>{row.sales_channel}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.tactics}</TableCell>
              <TableCell>メモ</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              {error ? error : "データがありません"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </CardContent>
</Card>

      {/* User Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>今日のあなたの報告履歴</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>報告者</TableHead>
                <TableHead>時間</TableHead>
                <TableHead>売り上げ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell>佐藤</TableCell>
                <TableCell>12:35</TableCell>
                <TableCell>50000円</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}