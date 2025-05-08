import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

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

type Props = {
  data: any[]
  columns: Column[]
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
  selectedFilters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export function CSortableTable({
  data,
  columns,
  sortConfig,
  onSortChange,
  selectedFilters,
  onFilterChange,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const safeData = Array.isArray(data) ? data : []

  const sortedData = [...safeData].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })

  const filteredData = sortedData.filter((row) => {
    const matchSales =
      selectedFilters.sales_channel === "すべて" ||
      row.sales_channel === selectedFilters.sales_channel
    const matchCategory =
      selectedFilters.category === "すべて" ||
      row.category === selectedFilters.category
    const matchTactics =
      selectedFilters.tactics === "すべて" ||
      row.tactics === selectedFilters.tactics
    return matchSales && matchCategory && matchTactics
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPageData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  )
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSort = (key: string) => {
    onSortChange(
      sortConfig?.key === key
        ? { key, direction: sortConfig.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
    setCurrentPage(1)
  }

  const renderArrow = (key: string) => {
    if (sortConfig?.key !== key) return "↕"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  return (
    <div>
      <table className="w-full text-sm text-left border">
        <thead className="bg-lime-200">
          <tr className="border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-2 cursor-pointer"
                onClick={() => handleSort(col.key)}
              >
                {col.label} {renderArrow(col.key)}
                {col.key === "sales_channel" && (
                  <Select
                    value={selectedFilters.sales_channel}
                    onValueChange={(v) =>
                      onFilterChange({ ...selectedFilters, sales_channel: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="すべて">すべて</SelectItem>
                      <SelectItem value="SM">スーパーマーケット</SelectItem>
                      <SelectItem value="HC">ホームセンター</SelectItem>
                      <SelectItem value="CVS">コンビニ</SelectItem>
                      <SelectItem value="DRUG">ドラッグストア</SelectItem>
                      <SelectItem value="EC">ECサイト</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {col.key === "category" && (
                  <Select
                    value={selectedFilters.category}
                    onValueChange={(v) =>
                      onFilterChange({ ...selectedFilters, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="すべて">すべて</SelectItem>
                      <SelectItem value="飲料">飲料</SelectItem>
                      <SelectItem value="酒類">酒類</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {col.key === "tactics" && (
                  <Select
                    value={selectedFilters.tactics}
                    onValueChange={(v) =>
                      onFilterChange({ ...selectedFilters, tactics: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="すべて">すべて</SelectItem>
                      <SelectItem value="チラシ">チラシ</SelectItem>
                      <SelectItem value="エンド">エンド</SelectItem>
                      <SelectItem value="企画">企画</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((row, idx) => (
            <tr key={idx} className="border-b even:bg-lime-50">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {col.format ? col.format(row[col.key]) : row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-2 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ← 前へ
        </button>
        <span>
          ページ {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
