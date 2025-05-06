import { useState } from "react"

type Column = {
  key: string
  label: string
  format?: (value: any) => React.ReactNode
}

type SortConfig = {
  key: string
  direction: "asc" | "desc"
} | null

type Props = {
  data: any[]
  columns: Column[]
}

export function SortableTable({ data, columns }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  const renderArrow = (key: string) => {
    if (sortConfig?.key !== key) return "↕"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  return (
    <table className="w-full text-sm text-left border">
      <thead>
        <tr className="border-b">
          {columns.map((col) => (
            <th
              key={col.key}
              className="p-2 cursor-pointer"
              onClick={() => handleSort(col.key)}
            >
              {col.label} {renderArrow(col.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, idx) => (
          <tr key={idx} className="border-b">
            {columns.map((col) => (
              <td key={col.key} className="p-2">
                {col.format ? col.format(row[col.key]) : row[col.key] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
