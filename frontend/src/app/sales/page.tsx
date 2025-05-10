'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function SalesHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = format(currentTime, "yyyy年MM月dd日 (EEE)", { locale: ja });
  const time = format(currentTime, "HH:mm:ss");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-700">売上管理おまかせくん</h1>

      <div className="p-6 bg-white rounded shadow-md space-y-4">
        <div className="text-xl font-semibold text-gray-600">
          📅 今日の日付: {today}
        </div>
        <div className="text-3xl font-bold text-gray-800">
          ⏰ 現在時刻: {time}
        </div>
      </div>
    </main>
  );
}
