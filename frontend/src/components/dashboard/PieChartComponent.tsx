'use client'

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function PieChartComponent({
    data,
    analysisType,
  }: {
    data: any[]
    analysisType: "category" | "channel" | "strategy"
  }){
  // 集計処理
  const aggregated = data.reduce((acc, item) => {
    const key = item[analysisType]
    acc[key] = (acc[key] || 0) + item.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(aggregated).map(([name, value]) => ({ name, value }))

  return (
    <PieChart width={320} height={240}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}
