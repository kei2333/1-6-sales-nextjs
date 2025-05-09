"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const pathTitleMap: { [key: string]: string } = {
  "/users": "従業員管理画面",
  "/users/tokyo": "東京本社",
  "/users/osaka": "大阪支店",
  "/users/nagoya": "名古屋支店",
};

export default function StickyHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const title = pathTitleMap[pathname] || "売上報告";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const userName = session?.user?.name ? session.user.name : "不明なユーザー";

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-600">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="underline text-sm">{userName} さん</span>
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
