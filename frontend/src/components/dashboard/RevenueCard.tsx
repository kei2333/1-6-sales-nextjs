import { ArrowUpRight } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function RevenueCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">売上（月次）</p>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">¥1,200,000</div>
        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <ArrowUpRight className="w-4 h-4" />
          前月比 +12%
        </div>
      </CardContent>
    </Card>
  )
}
