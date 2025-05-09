import { CheckCircle } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface Props {
  percentage: number
  target: number
}

export function AchievementCard({ percentage, target }: Props) {
  const formattedPercentage = `${(percentage * 100).toFixed(1)}%`
  const formattedTarget = `¥${target.toLocaleString()}`

  // 達成率によって色を分ける
  const percentageColor =
    percentage >= 1 ? "text-green-600" : "text-red-600"

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">達成率</p>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${percentageColor}`}>
          {formattedPercentage}
        </div>
        <div className={`text-sm ${percentageColor} flex items-center gap-1 mt-1`}>
          <CheckCircle className="w-4 h-4" />
          <span>目標額 {formattedTarget} に対して</span>
        </div>
      </CardContent>
    </Card>
  )
}
