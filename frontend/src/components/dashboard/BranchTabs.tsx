'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type BranchTabsProps = {
  value: string
  onValueChange: (value: string) => void
}

export function BranchTabs({ value, onValueChange }: BranchTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">全拠点</TabsTrigger>
        <TabsTrigger value="東京支店">東京支店</TabsTrigger>
        <TabsTrigger value="大阪支店">大阪支店</TabsTrigger>
        <TabsTrigger value="名古屋支店">名古屋支店</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
