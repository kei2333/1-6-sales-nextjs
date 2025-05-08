"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#33CC99"]

interface Props {
  data: { label: string; value: number }[]
  analysisType: "category" | "sales_channel" | "tactics"
  onChangeAnalysisType: (type: "category" | "sales_channel" | "tactics") => void
}

export function PieChartComponent({ data, analysisType, onChangeAnalysisType }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-semibold mb-2">
        分析軸: {analysisType === "category" ? "カテゴリ" : analysisType === "sales_channel" ? "チャネル" : "戦略"}
      </h3>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="40%"              // グラフを左寄せしてLegendのスペース確保
              cy="50%"
              outerRadius={100}
              innerRadius={70}
              paddingAngle={3}
              label={false}         // ✅ ラベル削除
              isAnimationActive
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`¥${value.toLocaleString()}`, name]} />
            <Legend
              layout="vertical"         // ✅ 縦並び
              align="right"             // ✅ 右側に配置
              verticalAlign="middle"   // ✅ 垂直方向中央揃え
              iconType="circle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-2 mb-4">
        <Button variant={analysisType === "category" ? "default" : "outline"} onClick={() => onChangeAnalysisType("category")}>
          商品カテゴリ
        </Button>
        <Button variant={analysisType === "sales_channel" ? "default" : "outline"} onClick={() => onChangeAnalysisType("sales_channel")}>
          チャネル
        </Button>
        <Button variant={analysisType === "tactics" ? "default" : "outline"} onClick={() => onChangeAnalysisType("tactics")}>
          戦略
        </Button>
      </div>

    </div>
  )
}
