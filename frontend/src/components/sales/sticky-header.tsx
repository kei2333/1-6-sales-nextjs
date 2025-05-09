"use client";

import { useSession } from "next-auth/react";
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

  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // loading中はユーザー表示を保留する
  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-600">{title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">読み込み中...</span>
        </div>
      </header>
    );
  }

  const displayName = session?.user?.name || "不明なユーザー";

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-600">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="underline text-sm">{displayName} さん</span>
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
