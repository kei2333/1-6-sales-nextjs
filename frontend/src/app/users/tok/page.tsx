// app/admin/users/page.tsx
"use client";

import UserTable from "@/components/users/UserTable";

export default function UserManagementPage() {
  return (
    <>
      <UserTable location_id={3} />
    </>
  );
}
