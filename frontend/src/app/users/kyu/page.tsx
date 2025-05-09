// app/admin/users/page.tsx
"use client";

import UserSearchBar from "@/components/users/UserSearchBar";
import UserTable from "@/components/users/UserTable";

export default function UserManagementPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <UserSearchBar />
      </div>
      <UserTable location_id={6}/>
    </>
  );
}
