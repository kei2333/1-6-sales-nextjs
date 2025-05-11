import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface PeriodTotalCardProps {
  amount: number;
  from?: Date;
  to?: Date;
}

function formatJapaneseDate(date?: Date) {
  if (!date) return "";
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function PeriodTotalCard({ amount, from, to }: PeriodTotalCardProps) {
  const formattedAmount = `¥${amount.toLocaleString()}`;
  const formattedRange =
    from && to
      ? `(${formatJapaneseDate(from)}〜${formatJapaneseDate(to)})`
      : "";

  return (
    <Card>
      <CardHeader className="min-w-[280px]">
        <p className="text-sm text-muted-foreground">選択期間の売上</p>
        {formattedRange && (
          <p className="text-xs text-muted-foreground mt-1">{formattedRange}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-center text-foreground">
          {formattedAmount}
        </div>
      </CardContent>
    </Card>
  );
}
