"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SortableTable } from "@/components/general/SortableTable";
// fetchするデータの型を定義
type SalesReport = {
  employee_number: number|string;
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
  const [newReport, setNewReport] = useState<SalesReport>({
    employee_number: 0,
    employee_name: "",
    sales_date: date.toDateString(),
    amount: 0,
    sales_channel: "SM",
    category: "飲料",
    tactics: "チラシ",
    memo: "",
    location_id: 1,
  });
  const location_id=1 //TODO:ユーザーのlocation_id参照
  const handleSubmitReport = async() => {
    try {
      console.log("newReport:", newReport)
      if(!date) {
        alert("日付を選択してください。")
        return
      }
      if(!newReport.employee_number) {
        alert("社員番号を入力してください。")
        return
      }
      if(!newReport.amount) {
        alert("売上を入力してください。")
        return
      }
      if(!newReport.sales_channel) {
        alert("チャネルを選択してください。")
        return
      }
      if(!newReport.category) {
        alert("商品カテゴリを選択してください。")
        return
      }
      if(!newReport.tactics) {
        alert("種別を選択してください。")
        return
      }
      if(!newReport.location_id) {
        alert("拠点を選択してください。")
        return
      }
      if(date && newReport.employee_number && newReport.amount && newReport.sales_channel && newReport.category && newReport.tactics && newReport.location_id) {
        alert("報告が完了しました。");
      }
      const res = await fetch(
        `https://team6-sales-function.azurewebsites.net/api/send_sales?sales_date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&location_id=${newReport.location_id}&employee_number=${newReport.employee_number}&amount=${newReport.amount}&sales_channel=${newReport.sales_channel}&category=${newReport.category}&tactics=${newReport.tactics}&memo=${newReport.memo}`      
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setNewReport({
        employee_number: 0,
        employee_name: "",
        sales_date: date.toDateString(),
        amount: 0,
        sales_channel: "SM",
        category: "飲料",
        tactics: "チラシ",
        memo: "",
        location_id: 1,
      });
    } catch (err) {
      console.error(err);
    }
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
            <form>
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
                <label className="block text-sm font-medium mb-1">担当者の社員番号</label>
                <Input 
                  type="text"
                  placeholder="社員番号"
                  value={newReport.employee_number || ""}
                  onChange={(e) => setNewReport({ ...newReport, employee_number: Number(e.target.value) })}
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
                placeholder="0"
                value={newReport.amount || ""}
                onChange={(e) => setNewReport({ ...newReport, amount: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">メモ</label>
              <Textarea
                name="memo"
                placeholder="メモ"
                value={newReport.memo || ""}
                onChange={(e) => setNewReport({ ...newReport, memo: e.target.value })}
              />
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleSubmitReport}>Submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="overflow-auto p-4">
          <SortableTable
            data={todayReports}
            columns={[
              { key: "sales_date", label: "日付" },
              { key: "employee_name", label: "報告者" },
              { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
              { key: "sales_channel", label: "チャネル"},
              { key: "category", label: "商品カテゴリ" },
              { key: "tactics", label: "種別" },
              { key: "memo1", label: "メモ" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}