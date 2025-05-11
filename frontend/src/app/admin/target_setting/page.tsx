"use client";

import { TargetForm } from "@/components/target_setting/TargetForm";
import { BranchTabs } from "@/components/dashboard/BranchTabs";
import { SortableTable } from "@/components/general/SortableTable";
import { useState, useEffect, useCallback } from "react";

type TargetItem = {
  month: string;
  targetAmount: number;
  actualAmount: number;
  achievementRate: string;
  comment: string;
};

type ApiResponseItem = {
  target_date: string;
  target_amount: number;
  memo?: string;
};

export default function TargetSettingPage() {
  const [branch, setBranch] = useState<string | undefined>(undefined);
  const [targetData, setTargetData] = useState<TargetItem[]>([]);

  const fetchTargetData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/get-sales-target${branch ? `?location_id=${branch}` : ""}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("取得失敗:", errorText);
        throw new Error("取得失敗");
      }

      const data: ApiResponseItem[] = await res.json();

      const transformedData: TargetItem[] = data.map((item) => ({
        month: item.target_date.slice(0, 7),
        targetAmount: item.target_amount,
        actualAmount: 0, // actualAmount は現在DBにないので0固定
        achievementRate: "0", // 仮で0%固定
        comment: item.memo ?? "-",
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
  }): Promise<boolean> => {
    const payload = {
      target_date: `${formData.month}-01`,
      location_id: branch ? Number(branch) : 1,
      target_amount: formData.target,
      memo: formData.comment,
    };

    try {
      const res = await fetch("/api/post-sales-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("送信失敗:", errorText);
        return false;
      }

      await res.json();
      fetchTargetData();
      return true;
    } catch (err) {
      console.error("送信エラー:", err);
      return false;
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
