import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportCsvButton } from "@/components/general/ExportCsvButton"
import { CSortableTable } from "@/components/general/CSortableTable"
import { DateRange } from "react-day-picker"

type Props = {
  title?: string
  data: any[]
  columns: Column[]
  dateRange: DateRange | undefined // ← 追加
}


type Column = {
  key: string
  label: string
  format?: (value: any) => React.ReactNode
}

type SortConfig = {
  key: string
  direction: "asc" | "desc"
} | null

type FilterState = {
  sales_channel: string
  category: string
  tactics: string
}


export function CsvSortableTableCard({ title, data, columns, dateRange }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [filters, setFilters] = useState<FilterState>({
    sales_channel: "すべて",
    category: "すべて",
    tactics: "すべて",
  })

  // フィルタ済データ
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchSales =
        filters.sales_channel === "すべて" || row.sales_channel === filters.sales_channel
      const matchCategory =
        filters.category === "すべて" || row.category === filters.category
      const matchTactics =
        filters.tactics === "すべて" || row.tactics === filters.tactics
      return matchSales && matchCategory && matchTactics
    })
  }, [data, filters])

  // ソート済データ
  const sortedFilteredData = useMemo(() => {
    const sorted = [...filteredData]
    if (sortConfig) {
      const { key, direction } = sortConfig
      sorted.sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1
        return 0
      })
    }
    return sorted
  }, [filteredData, sortConfig])

  // ファイル名を動的に構築
    const filename = useMemo(() => {
      const parts = []
    
      // 既存のフィルタやソート情報
      if (filters.sales_channel !== "すべて") parts.push(filters.sales_channel)
      if (filters.category !== "すべて") parts.push(filters.category)
      if (filters.tactics !== "すべて") parts.push(filters.tactics)
      if (sortConfig) parts.push(`${sortConfig.key}_${sortConfig.direction}`)
    
      // 🔽 ここで日付範囲を追加
      if (dateRange?.from && dateRange?.to) {
        const format = (d: Date) => d.toLocaleDateString("sv-SE")
        parts.push(`${format(dateRange.from)}_to_${format(dateRange.to)}`)
      }
    
      return `sales-${parts.join("_") || "all"}.csv`
    }, [filters, sortConfig, dateRange])
  

  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <ExportCsvButton data={sortedFilteredData} filename={filename} />
      </CardHeader>
      <CardContent>
        <CSortableTable
          data={data}
          columns={columns}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          selectedFilters={filters}
          onFilterChange={setFilters}
        />
      </CardContent>
    </Card>
  )
}
