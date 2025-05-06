'use client'

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#33CC99"]

export function PieChartComponent({
  data,
  analysisType,
}: {
  data: { label: string; value: number }[]
  analysisType: "category" | "sales_channel" | "tactics"
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        分析軸: {analysisType === "category" ? "カテゴリ" : analysisType === "sales_channel" ? "チャネル" : "戦略"}
      </h3>
      <PieChart width={380} height={280}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={false}
          label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  )
}
