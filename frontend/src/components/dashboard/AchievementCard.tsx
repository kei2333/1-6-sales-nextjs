import { CheckCircle } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface AchievementCardProps {
  currentAmount: number           // 現在の売上
  percentage: number              // 例: 0.728 → 72.8%
  target: number                  // 目標金額（円）
}

export function AchievementCard({
  currentAmount,
  percentage,
  target,
}: AchievementCardProps) {
  const formattedCurrent = `¥${(currentAmount ?? 0).toLocaleString()}`
  const formattedTarget = `¥${(target ?? 0).toLocaleString()}`
  const formattedPercentage = `${((percentage ?? 0) * 100).toFixed(1)}%`

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">目標達成状況</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {/* 左側：現在の売上 */}
          <div>
            <div className="text-lg text-muted-foreground">現在の売上</div>
            <div className="text-3xl font-bold text-foreground">{formattedCurrent}</div>
          </div>

          {/* 右側：達成率など */}
          <div className="text-right">
            <div className="text-lg text-muted-foreground">達成率</div>
            <div className="text-2xl font-semibold text-yellow-600">{formattedPercentage}</div>

            <div className="text-xs text-yellow-600 flex items-center gap-1 justify-end mt-1">
              <CheckCircle className="w-4 h-4" />
              <span>目標額 {formattedTarget} に対して</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
