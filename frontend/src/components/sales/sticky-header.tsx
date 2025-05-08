"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const pathTitleMap: { [key: string]: string } = {
  "/sales/today": "今日の売上報告",
  "/sales/history": "過去の売上報告",
  "/sales/entry": "売上報告をする",
};

export default function StickyHeader() {
  const pathname = usePathname();
  const title = pathTitleMap[pathname] || "売上報告";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // ログアウト後トップページに戻る
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-600">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="underline text-sm">田中さん</span>
        <Button
          className="bg-lime-400 hover:bg-lime-500 text-black"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          ログアウト
        </Button>
      </div>
    </header>
  );
}
