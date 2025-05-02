// components/UserSearchBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function UserSearchBar() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const handleSearch = () => {
    // 🔍 フィルター処理をここで呼び出す
    console.log("検索ワード:", query);
    console.log("部署:", department);
  };

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {/* 名前検索 */}
      <Input
        placeholder="名前で検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      {/* 部署選択 */}
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="部署を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全体</SelectItem>
          <SelectItem value="sales">営業</SelectItem>
          <SelectItem value="admin">管理</SelectItem>
          <SelectItem value="support">サポート</SelectItem>
        </SelectContent>
      </Select>

      {/* 検索ボタン */}
      <Button onClick={handleSearch}>検索</Button>
    </div>
  );
}
