'use client'

import { useState, useEffect } from "react"
import { BranchTabs } from "@/components/dashboard/BranchTabs"
import { TargetForm } from "@/components/target_setting/TargetForm"
import { SortableTable } from "@/components/general/SortableTable"

export default function TargetSettingPage() {
  const [branch, setBranch] = useState<string | undefined>(undefined);

  const [targetData, setTargetData] = useState<any[]>([])
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true"

  useEffect(() => {
    const fetchTargetData = async () => {
      if (isMockMode) {
        console.log("✅ MOCKモード：ローカルデータ使用")
        setTargetData([
          { month: "2025-04", targetAmount: 1000000, actualAmount: 1050000, achievementRate: 105, comment: "順調" },
          { month: "2025-03", targetAmount: 950000, actualAmount: 910000, achievementRate: 95.7, comment: "やや未達" },
          { month: "2025-02", targetAmount: 900000, actualAmount: 920000, achievementRate: 102.2 },
        ])
        return
      }

      try {
        const res = await fetch(`/api/get-target?branch=${branch}`)
        if (!res.ok) throw new Error("取得失敗")
        const data = await res.json()
        setTargetData(data)
        console.log("🎯 実データ取得:", data)
      } catch (err) {
        console.error("目標取得エラー:", err)
      }
    }

    fetchTargetData()
  }, [branch, isMockMode])

  const handleSubmit = async (formData: { month: string; target: number; comment: string }) => {
    const payload = { ...formData, branch }

    try {
      const res = await fetch("/api/set-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("送信失敗")
      const result = await res.json()
      console.log("登録成功:", result)

      if (isMockMode) {
        setTargetData((prev) => [
          {
            month: formData.month,
            targetAmount: formData.target,
            actualAmount: 0,
            achievementRate: 0,
            comment: formData.comment,
          },
          ...prev,
        ])
      } else {
        // TODO: データ再取得するなら fetchTargetData を抽出して再実行
      }
    } catch (err) {
      console.error("送信エラー:", err)
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-6">
      <BranchTabs value={branch} onValueChange={setBranch} />
      <div className="flex flex-col gap-6">
        <TargetForm onSubmit={handleSubmit} />
        <SortableTable
          data={targetData}
          columns={[
            { key: "month", label: "年月" },
            { key: "targetAmount", label: "目標", format: (v) => `¥${v.toLocaleString()}` },
            { key: "actualAmount", label: "実績", format: (v) => `¥${v.toLocaleString()}` },
            { key: "achievementRate", label: "達成率", format: (v) => `${v}%` },
            { key: "comment", label: "備考" },
          ]}
        />
      </div>
    </div>
  )
}
