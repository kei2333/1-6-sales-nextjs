// app/test/sales_report/page.tsx

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

export default function SalesReportPage() {
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
        {[
          { name: "佐藤", time: "12:35", amount: "50000円", channel: "ECサイト", category: "飲料", type: "エンド" },
          { name: "吉田", time: "14:35", amount: "50000円", channel: "スーパーマーケット", category: "飲料", type: "チラシ" },
          { name: "ケイ", time: "20:35", amount: "50000円", channel: "ECサイト", category: "酒類", type: "エンド" },
        ].map((row, i) => (
          <TableRow key={i}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.time}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.channel}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>メモ</TableCell>
          </TableRow>
        ))}
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