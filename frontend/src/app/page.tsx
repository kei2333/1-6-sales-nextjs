'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#BAC43E]/40 space-y-4">
      {/* タイトルを白いボックスの上に配置 */}
      <h1 className="text-2xl font-bold text-gray-800">売上管理おまかせくん</h1>

      <div className="w-full max-w-sm bg-white p-8 rounded shadow-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">ログイン</h2>
          <p className="text-sm text-gray-500">
            ログインできない方は管理者にお問い合わせください。
          </p>
        </div>
        <div className="space-y-4">
          <Input placeholder="社員番号" />
          <Input type="password" placeholder="パスワード" />
          <Button className="w-full">ログイン</Button>
        </div>
      </div>
    </div>
  );
}
