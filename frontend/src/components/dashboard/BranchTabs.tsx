'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type BranchTabsProps = {
  value: string | undefined // ← 全拠点は undefined にする
  onValueChange: (value: string | undefined) => void
}

// 支店リスト定義（拡張性◎）
const branches = [
  { name: "全拠点", locationId: undefined },
  { name: "関東広域", locationId: "1" },
  { name: "北陸", locationId: "2" },
  { name: "東海", locationId: "3" },
  { name: "近畿", locationId: "4" }, // 必要なら追加
  { name: "中四国", locationId: "5" },
  { name: "九州", locationId: "6" },
]

export function BranchTabs({ value, onValueChange }: BranchTabsProps) {
  return (
    <Tabs value={value ?? ""} onValueChange={(v) => onValueChange(v || undefined)}>
      <TabsList className="mb-4">
        {branches.map((branch) => (
          <TabsTrigger key={branch.name} value={branch.locationId ?? ""}>
            {branch.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
