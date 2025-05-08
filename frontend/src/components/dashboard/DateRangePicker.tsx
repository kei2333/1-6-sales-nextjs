'use client'

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

type Props = {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}

export function DateRangePicker({ date, setDate, className }: Props) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">日付範囲を選択</h2>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setDate(undefined)}
        >
          リセット
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} –{" "}
                  {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>期間を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
        <Calendar
            selected={date}
            onSelect={(val) => {
              if (!val || typeof val === 'object' && 'from' in val) {
                setDate(val as DateRange)
              }
            }}
            defaultMonth={date?.from}
            numberOfMonths={2}
          />

        </PopoverContent>
      </Popover>
    </div>
  )
}
