"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SortableTable } from "@/components/general/SortableTable";

type SalesReport = {
  employee_number: number | string;
  employee_name: string;
  sales_date: string;
  amount: number | string;
  sales_channel: string;
  category: string;
  tactics: string;
  memo: string | null;
  location_id: number;
};

export default function ReportEntryDashboard() {
  const { data: session, status } = useSession();
  const [todayReports, setTodayReports] = useState<SalesReport[]>([]);
  const [date, setDate] = useState(new Date());
  const [newReport, setNewReport] = useState<SalesReport | null>(null);
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setNewReport({
        employee_number: 0,
        employee_name: "",
        sales_date: date.toDateString(),
        amount: "",
        sales_channel: "SM",
        category: "飲料",
        tactics: "チラシ",
        memo: "",
        location_id: session.user.location_id,
      });
    }
  }, [session, date]);

  useEffect(() => {
    async function fetchSales() {
      if (!session?.user) return;
      try {
        const res = await fetch(
          `https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date_from=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&sales_date_until=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&location_id=${session.user.location_id}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setTodayReports(json);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSales();
  }, [session, date]);

  if (status === "loading" || !newReport) {
    return <p>読み込み中...</p>;
  }

  if (!session?.user) {
    return <p>ログインが必要です。</p>;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setAmountError("");
      setNewReport({ ...newReport, amount: value });
    } else {
      setAmountError("売上は半角数字で入力してください。");
    }
  };

  const handleSubmitReport = async () => {
    if (amountError) {
      alert("エラーを修正してください。");
      return;
    }

    if (!date || !newReport.employee_number || !newReport.amount || !newReport.sales_channel || !newReport.category || !newReport.tactics || !newReport.location_id) {
      alert("全ての項目を入力してください。");
      return;
    }

    try {
      alert("報告が完了しました。");

      const res = await fetch(
        `https://team6-sales-function.azurewebsites.net/api/send_sales?sales_date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&location_id=${newReport.location_id}&employee_number=${newReport.employee_number}&amount=${newReport.amount}&sales_channel=${newReport.sales_channel}&category=${newReport.category}&tactics=${newReport.tactics}&memo=${newReport.memo}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setNewReport({
        ...newReport,
        amount: "",
        memo: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const locationLabel = (id: number) =>
    id === 1
      ? "関東広域"
      : id === 2
      ? "北陸"
      : id === 3
      ? "東海"
      : id === 4
      ? "近畿"
      : id === 5
      ? "中四国"
      : id === 6
      ? "九州"
      : "不明";

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 bg-white rounded-3xl border">
          <CardContent className="space-y-4 p-4">
            <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">日付</label>
                <Input
                  type="date"
                  placeholder="年月日"
                  onChange={(e) => setDate(new Date(e.target.value))}
                  value={date.toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                {/*TODO: スタイルを周りのインプットに合わせる。枠など。*/}
                <label className="block text-sm font-medium mb-1">拠点</label>
                <Select value={newReport.location_id.toString()} onValueChange={(value) => setNewReport({ ...newReport, location_id:Number(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'1'}>関東広域</SelectItem>
                    <SelectItem value={'2'}>北陸</SelectItem>
                    <SelectItem value={'3'}>東海</SelectItem>
                    <SelectItem value={'4'}>近畿</SelectItem>
                    <SelectItem value={'5'}>中四国</SelectItem>
                    <SelectItem value={'6'}>九州</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select value={newReport.category} onValueChange={(value) => setNewReport({ ...newReport, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="飲料">飲料</SelectItem>
                    <SelectItem value="酒類">酒類</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">種別</label>
                <Select value={newReport.tactics} onValueChange={(value) => setNewReport({ ...newReport, tactics: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="チラシ">チラシ</SelectItem>
                    <SelectItem value="エンド">エンド</SelectItem>
                    <SelectItem value="企画">企画</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">チャネル</label>
                <Select value={newReport.sales_channel} onValueChange={(value) => setNewReport({ ...newReport, sales_channel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SM">スーパーマーケット</SelectItem>
                    <SelectItem value="HC">ホームセンター</SelectItem>
                    <SelectItem value="CVS">コンビニ</SelectItem>
                    <SelectItem value="DRUG">ドラッグストア</SelectItem>
                    <SelectItem value="EC">ECサイト</SelectItem>
                  </SelectContent>
                </Select>
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
        <CardHeader>
          <CardTitle>
            本日{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日の
            {locationLabel(newReport.location_id)}拠点の報告状況
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto p-4">
          {todayReports.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <SortableTable
              data={todayReports}
              columns={[
                { key: "sales_date", label: "日付" },
                { key: "employee_name", label: "報告者" },
                { key: "amount", label: "売り上げ", format: (v) => `¥${v.toLocaleString()}` },
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
