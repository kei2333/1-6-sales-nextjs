import { CheckCircle } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function AchievementCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">目標達成度</p>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">80%</div>
        <div className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
          <CheckCircle className="w-4 h-4" />
          目標 90% に対して
        </div>
      </CardContent>
    </Card>
  )
}
