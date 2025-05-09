import { ArrowDown } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function CurrentSalesCard({ amount }: { amount: number }) {
  const formatted = `¥${amount.toLocaleString()}`

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">現在の売上</p>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground">{formatted}</div>

        <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
          <ArrowDown className="w-4 h-4" />
          <span>前月比 -10%</span>
        </div>
      </CardContent>
    </Card>
  )
}
