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

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState("");

  const myEmployeeNumber = 12345; // 報告者別フィルター用変数
  const LocationId = 2; // 拠点別フィルター用変数

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/get-sales?sales_date=2025-03-03&location_id=2');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setReports(json);
      } catch (err) {
        console.error(err);
        setError('データ取得に失敗しました');
      }
    }

    fetchSales();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  // 今日かつ大阪のデータに限定
  const todayOsakaReports = reports.filter(
    (r) => r.sales_date === today && r.location_id === LocationId
  );

  const yourReports = todayOsakaReports.filter(
    (r) => r.employee_number === myEmployeeNumber
  );

  return (
    <main className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">今日の売上報告（大阪拠点）</h2>

      {/* 大阪拠点 */}
      <Card>
        <CardHeader>
          <CardTitle>今日の大阪拠点の報告状況</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : todayOsakaReports.length === 0 ? (
            <p>今日の大阪拠点のデータはありません。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>報告ID</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>売り上げ</TableHead>
                  <TableHead>チャネル</TableHead>
                  <TableHead>商品カテゴリ</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>従業員番号</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayOsakaReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.sales_date}</TableCell>
                    <TableCell>{r.amount}円</TableCell>
                    <TableCell>{r.sales_channel}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.tactics}</TableCell>
                    <TableCell>{r.employee_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* あなたの履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>今日のあなたの報告履歴（大阪拠点）</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : yourReports.length === 0 ? (
            <p>今日のあなたの履歴はありません。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>報告ID</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>売り上げ</TableHead>
                  <TableHead>チャネル</TableHead>
                  <TableHead>商品カテゴリ</TableHead>
                  <TableHead>種別</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yourReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.sales_date}</TableCell>
                    <TableCell>{r.amount}円</TableCell>
                    <TableCell>{r.sales_channel}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.tactics}</TableCell>
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
