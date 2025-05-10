"use client";

import { useState, useEffect, useCallback } from "react";
import { BranchTabs } from "@/components/dashboard/BranchTabs";
import { TargetForm } from "@/components/target_setting/TargetForm";
import { SortableTable } from "@/components/general/SortableTable";

// 画面側で使う型
type TargetItem = {
  month: string;
  targetAmount: number;
  actualAmount: number;
  achievementRate: string;
  comment: string;
};

// APIレスポンス用の型
type ApiResponseItem = {
  target_date: string;
  target_amount: number;
  actual_amount?: number;
  comment?: string;
};

export default function TargetSettingPage() {
  const [branch, setBranch] = useState<string | undefined>(undefined);
  const [targetData, setTargetData] = useState<TargetItem[]>([]);

  const fetchTargetData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/get-sales-target${branch ? `?branch=${branch}` : ""}`
      );
      if (!res.ok) throw new Error("取得失敗");
      const data: ApiResponseItem[] = await res.json();

      const transformedData: TargetItem[] = data.map((item) => ({
        month: item.target_date.slice(0, 7), // 例: '2025-05-10' → '2025-05'
        targetAmount: item.target_amount,
        actualAmount: item.actual_amount ?? 0,
        achievementRate: item.actual_amount
          ? ((item.actual_amount / item.target_amount) * 100).toFixed(1)
          : "0",
        comment: item.comment ?? "-",
      }));

      setTargetData(transformedData);
      console.log("🎯 実データ取得:", transformedData);
    } catch (err) {
      console.error("目標取得エラー:", err);
    }
  }, [branch]);

  useEffect(() => {
    fetchTargetData();
  }, [fetchTargetData]);

  const handleSubmit = async (formData: {
    month: string;
    target: number;
    comment: string;
  }) => {
    const payload = {
      target_date: `${formData.month}-01`, // '2025-05' → '2025-05-01'
      location_id: branch ? Number(branch) : 1, // branch を location_id に
      target_amount: formData.target,
      comment: formData.comment,
    };

    try {
      const res = await fetch("/api/post-sales-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("送信失敗");
      const result = await res.json();
      console.log("登録成功:", result);

      // 登録後データを再取得
      fetchTargetData();
    } catch (err) {
      console.error("送信エラー:", err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-6">
      <BranchTabs value={branch} onValueChange={setBranch} />
      <div className="flex flex-col gap-6">
        <TargetForm onSubmit={handleSubmit} />
        <SortableTable
          data={targetData}
          columns={[
            { key: "month", label: "年月" },
            {
              key: "targetAmount",
              label: "目標",
              format: (v) => `¥${v.toLocaleString()}`,
            },
            {
              key: "actualAmount",
              label: "実績",
              format: (v) => `¥${v.toLocaleString()}`,
            },
            { key: "achievementRate", label: "達成率", format: (v) => `${v}%` },
            { key: "comment", label: "備考" },
          ]}
        />
      </div>
    </div>
  );
}
