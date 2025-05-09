// app/admin/users/page.tsx
"use client";

import { CsvUserTable } from "@/components/users/CsvUserTable"; // ★ ここが正しいパスか確認！

export default function UserManagementPage() {
  return (
    <div className="p-6">
      <CsvUserTable location_id={6}/>
    </div>
  );
}
