"use client";

import { Button } from "@/components/ui/button";

export function ExportCsvButton({
  data,
  filename = "sales.csv",
}: {
  data: any[];
  filename?: string;
}) {
  const handleExport = () => {
    if (!data?.length) return;

    const csvHeaders = Object.keys(data[0]);
    const csvRows = data.map((row) =>
      csvHeaders
        .map(
          (field) => `"${(row[field] ?? "").toString().replace(/"/g, '""')}"`
        )
        .join(",")
    );

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-lime-400 hover:bg-lime-500 text-black font-bold px-4"
    >
      CSV出力
    </Button>
  );
}
