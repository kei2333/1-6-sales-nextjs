"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  data: { label: string; value: number }[]
  highlightLabel?: string
}
const BRANCH_NAME_MAP: Record<string, string> = {
  "1": "関東広域",
  "2": "北陸",
  "3": "東海",
  "4": "近畿",
  "5": "中四国",
  "6": "九州",
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#8884D8", "#FF6666", "#82ca9d", "#ffc658"
]

export const BranchSalesPieChart = ({ data, highlightLabel }: Props) => {
  return (
    <Card>
      <CardContent className="pt-6 pb-4 px-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">拠点別売上分布</h3>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="40%"
                cy="50%"
                outerRadius={100}
                innerRadius={70}
                paddingAngle={3}
                isAnimationActive
              >
                {data.map((entry, index) => {
                  const isHighlighted = highlightLabel === entry.label
                  return (
                    <Cell
                      key={`branch-slice-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={isHighlighted ? "#111" : "#fff"}
                      strokeWidth={isHighlighted ? 3 : 1}
                    />
                  )
                })}
              </Pie>

              <Tooltip
                formatter={(value: number, name: string) => [`¥${value.toLocaleString()}`, name]}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                formatter={(value) => BRANCH_NAME_MAP[value as string] || "未設定"}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
