// app/admin/users/page.tsx
"use client";

import UserSearchBar from "@/components/users/UserSearchBar";
import UserTable from "@/components/users/UserTable";
import LogoutButton from '@/components/dashboard/sticky-header';


export default function UserManagementPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <UserSearchBar />
      </div>
      <UserTable />
    </>
  );
}
