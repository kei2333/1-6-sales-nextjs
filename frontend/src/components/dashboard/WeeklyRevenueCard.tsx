import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface WeeklyRevenueCardProps {
  value: number;
  changePercentage?: number; // 前週比
}

export function WeeklyRevenueCard({
  value,
  changePercentage,
}: WeeklyRevenueCardProps) {
  const isPositive = changePercentage === undefined || changePercentage >= 0;
  const formattedValue = `¥${(value ?? 0).toLocaleString()}`;
  const formattedChange =
    changePercentage !== undefined
      ? `${isPositive ? "+" : "-"}${Math.abs(changePercentage)}%`
      : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">先週の売り上げ</p>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formattedValue}</div>

        {formattedChange !== null && (
          <div
            className={`text-xs mt-1 flex items-center gap-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            前週比 {formattedChange}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
