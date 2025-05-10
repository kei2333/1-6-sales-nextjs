import { useState } from "react";
import React from "react";

// 列定義型
type Column<T> = {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T]) => React.ReactNode;
};

// ソート設定型
type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

// コンポーネントProps型
type Props<T> = {
  data: T[];
  columns: Column<T>[];
};

export function SortableTable<T>({ data, columns }: Props<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const renderArrow = (key: keyof T) => {
    if (sortConfig?.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <table className="w-full text-sm text-left border">
      <thead>
        <tr className="border-b">
          {columns.map((col) => (
            <th
              key={String(col.key)}
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
              <td key={String(col.key)} className="p-2">
                {col.format
                  ? col.format(row[col.key])
                  : row[col.key] !== undefined && row[col.key] !== null
                  ? String(row[col.key])
                  : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
