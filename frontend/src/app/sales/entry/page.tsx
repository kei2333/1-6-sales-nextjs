"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useState } from "react";
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
}

export default function ReportEntryDashboard() {
  const [todayReports, setTodayReports] = useState<SalesReport[]>([]);
  const [date, setDate] = useState(new Date());

  const taskData = [
    { task: "FIG-123", title: "Task 1", project: "Project 1", priority: "High", date: "Dec 5", owner: "🧑" },
    { task: "FIG-122", title: "Task 2", project: "Acme GTM", priority: "Low", date: "Dec 5", owner: "🧑" },
    { task: "FIG-121", title: "Write blog post for demo day", project: "Acme GTM", priority: "High", date: "Dec 5", owner: "🧑" },
    { task: "FIG-120", title: "Publish blog page", project: "Website launch", priority: "Low", date: "Dec 5", owner: "🧑" },
    { task: "FIG-119", title: "Add gradients to design system", project: "Design backlog", priority: "Medium", date: "Dec 5", owner: "🧑" },
    { task: "FIG-118", title: "Responsive behavior doesn’t work on Android", project: "Bug fixes", priority: "Medium", date: "Dec 5", owner: "🧑" },
  ];
  const location_id=2 //TODO:ユーザーのlocation_id参照

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
        console.log(json)
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
                <Input placeholder="mmddyy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">拠点</label>
                <Input placeholder="拠点 Input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">担当者</label>
                <Input placeholder="担当者 名前" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">カテゴリ</label>
                <Input placeholder="カテゴリ mmddyy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tactics</label>
                <Input placeholder="Tactics mmddyy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Channel</label>
                <Input placeholder="Channel mmddyy" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">売上（¥）</label>
              <Input placeholder="¥" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">メモ</label>
              <Textarea placeholder="メモ" />
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
                <TableHead>Task</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskData.map((task, idx) => (
                <TableRow key={idx}>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>{task.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}