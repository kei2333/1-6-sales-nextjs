"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Filter } from "lucide-react";

// fetchするデータの型を定義
type SalesReport = {
  employee_name: string;
  sales_date: string;
  amount: number;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string|null;
  location_id: number;
}

export default function ReportEntryDashboard() {
  const [todayReports, setTodayReports] = useState<SalesReport[]>([]);
  const [date, setDate] = useState(new Date());
  const [currentEmployeeLocation, setCurrentEmployeeLocation] = useState<number>(1);
  const [newReport, setNewReport] = useState<SalesReport>({
    employee_name: "",
    sales_date: "",
    amount: 0,
    sales_channel: "",
    category: "",
    tactics: "",
    memo: null,
    location_id: 1,
  });
  const location_id=2 //TODO:ユーザーのlocation_id参照
  const handleSetCurrentEmployeeLocation = (location: number) => {
    setNewReport({
      ...newReport,
      location_id: location,
    });
  }

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(
          `https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date_from=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&sales_date_until=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&location_id=${location_id}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        console.log("date:", date, json)
        setTodayReports(json);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSales();
  }, [date]);
  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl bg-purple-100 flex items-center justify-center min-h-[300px]">
          <CardContent className="p-4">
            <Calendar
              selected={date}
              onSelect={(selected) => selected && setDate(selected)}
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-white rounded-3xl border">

          <CardContent className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">日付</label>
                <Input
                  type="text"
                  placeholder="年月日"
                  value={format(date, 'yyyy年M月d日')}
                  required
                />
              </div>
              <div>
                {/*TODO: スタイルを周りのインプットに合わせる。枠など。*/}
                <label className="block text-sm font-medium mb-1">拠点</label>
                  <select value={newReport.location_id} onChange={(e)=>setNewReport({...newReport, location_id:Number(e.target.value)})} required>
                    <option value={1}>関東広域</option>
                    <option value={2}>北陸</option>
                    <option value={3}>東海</option>
                    <option value={4}>近畿</option>
                    <option value={5}>中四国</option>
                    <option value={6}>九州</option>
                  </select>
                
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">担当者</label>
                <Input 
                  type="text"
                  placeholder="担当者 名前"
                  value={newReport.employee_name}
                  onChange={(e) => setNewReport({ ...newReport, employee_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">商品カテゴリ</label>
                <select value={newReport.category} onChange={(e)=>setNewReport({...newReport, category:e.target.value})} required>
                    <option value={'飲料'}>飲料</option>
                    <option value={'酒類'}>酒類</option>
                    <option value={'食品'}>食品</option>
                    <option value={'その他'}>その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">種別</label>
                <select value={newReport.tactics} onChange={(e)=>setNewReport({...newReport, tactics:e.target.value})} required>
                    <option value={'チラシ'}>チラシ</option>
                    <option value={'エンド'}>エンド</option>
                    <option value={'企画'}>企画</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">チャネル</label>
                <select value={newReport.sales_channel} onChange={(e)=>setNewReport({...newReport, sales_channel:e.target.value})} required>
                    <option value={'SM'}>スーパーマーケット</option>
                    <option value={'HC'}>ホームセンター</option>
                    <option value={'CVS'}>コンビニ</option>
                    <option value={'DRUG'}>ドラッグストア</option>
                    <option value={'EC'}>ECサイト</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">売上（円）</label>
              <Input
                type="number"
                min={0}
                placeholder="0円"
                value={newReport.amount || ""}
                onChange={(e) => setNewReport({ ...newReport, amount: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">メモ</label>
              <Textarea
                placeholder="メモ"
                value={newReport.memo || ""}
                onChange={(e) => setNewReport({ ...newReport, memo: e.target.value })}
              />
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800">Submit</Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search tickets..." className="max-w-xs" />
        <Button variant="outline"><Filter className="w-4 h-4 mr-1" />Filter</Button>
      </div>

      <Card>
        <CardContent className="overflow-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>報告者</TableHead>
                <TableHead>売り上げ</TableHead>
                <TableHead>チャネル</TableHead>
                <TableHead>商品カテゴリ</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>メモ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>{report.sales_date}</TableCell>
                  <TableCell>{report.employee_name}</TableCell>
                  <TableCell>{report.amount}円</TableCell>
                  <TableCell>{report.sales_channel}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.tactics}</TableCell>
                  <TableCell>{report.memo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}