import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";


export default function OsakaMarchReport() {
  const data = [
    { date: "2025年3月2日", time: "12:35", reporter: "田中健太郎", sales: "50000円", channel: "EC", category: "飲料", type: "エンド", memo: "メモ" },
    { date: "2025年3月2日", time: "12:35", reporter: "田中健太郎", sales: "50000円", channel: "EC", category: "飲料", type: "エンド", memo: "メモ" },
    { date: "2025年3月2日", time: "12:35", reporter: "田中健太郎", sales: "50000円", channel: "EC", category: "飲料", type: "チラシ", memo: "メモ" },
    { date: "2025年3月2日", time: "12:35", reporter: "田中健太郎", sales: "50000円", channel: "EC", category: "飲料", type: "チラシ", memo: "メモ" },
    { date: "2025年3月2日", time: "12:35", reporter: "田中健太郎", sales: "50000円", channel: "EC", category: "飲料", type: "企画", memo: "メモ" },
  ];

  return (
    <div className="p-6">

      <div className="text-xl font-semibold mb-4">2025年3月の大阪拠点の報告状況</div>

      <div className="flex items-center mb-4 gap-2">
        <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />前年</Button>
        <Tabs defaultValue="3">
          <TabsList className="grid grid-cols-12 w-full max-w-xl">
            {[...Array(12)].map((_, i) => (
              <TabsTrigger key={i} value={(i + 1).toString()}>{i + 1}月</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm">翌年<ChevronRight className="w-4 h-4 ml-1" /></Button>
      </div>

      <Card>
        <CardContent className="overflow-auto p-4">
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
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.reporter}</TableCell>
                  <TableCell>{item.sales}</TableCell>
                  <TableCell>{item.channel}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.memo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
