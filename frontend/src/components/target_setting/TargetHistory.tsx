"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type TargetData = {
  id: number;
  target_date: string;
  location_id: number;
  target_amount: number;
  actual_amount: number | null;
  memo: string;
};

export function TargetHistory({ locationId }: { locationId: number }) {
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await fetch(`/api/get-target?location_id=${locationId}`);
        const data = await res.json();
        setTargets(data);
      } catch (e) {
        console.error("データ取得エラー:", e);
        setError("データ取得に失敗しました");
      }
    };

    fetchTargets();
  }, [locationId]);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2">売上目標履歴</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">月</th>
                <th className="p-2">目標額</th>
                <th className="p-2">実績額</th>
                <th className="p-2">達成率</th>
                <th className="p-2">メモ</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((t) => {
                const rate =
                  t.actual_amount !== null && t.target_amount > 0
                    ? `${((t.actual_amount / t.target_amount) * 100).toFixed(
                        1
                      )}%`
                    : "-";

                return (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{t.target_date.slice(0, 7)}</td>
                    <td className="p-2">¥{t.target_amount.toLocaleString()}</td>
                    <td className="p-2">
                      {t.actual_amount !== null
                        ? `¥${t.actual_amount.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="p-2">{rate}</td>
                    <td className="p-2">{t.memo || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
