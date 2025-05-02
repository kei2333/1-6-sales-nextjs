// app/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reports = [
  { name: "佐藤", time: "12:35", amount: "500000円", channel: "ECサイト", category: "飲料", type: "エンド", note: "×メモ" },
  { name: "吉田", time: "14:35", amount: "500000円", channel: "スーパーマーケット", category: "飲料", type: "チラシ", note: "メモ" },
  { name: "ケイ", time: "20:35", amount: "500000円", channel: "ECサイト", category: "酒類", type: "エンド", note: "×メモ" },
];

const yourReport = [
  { time: "12:35", amount: "50000円", channel: "ECサイト", category: "飲料", type: "エンド", note: "メモ" },
];

export default function AdminPage() {
  return (
    <main className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">今日の売上報告</h2>

      {/* 大阪拠点 */}
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
              {reports.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.time}</TableCell>
                  <TableCell>{r.amount}</TableCell>
                  <TableCell>{r.channel}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* あなたの履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>今日のあなたの報告履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>時間</TableHead>
                <TableHead>売り上げ</TableHead>
                <TableHead>チャネル</TableHead>
                <TableHead>商品カテゴリ</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>メモ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yourReport.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.time}</TableCell>
                  <TableCell>{r.amount}</TableCell>
                  <TableCell>{r.channel}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
