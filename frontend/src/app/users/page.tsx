'use client';

import { useSession } from "next-auth/react";

export default function UserManagementPage() {
  const { data: session, status } = useSession();

  console.log("UserManagementPage status:", status);
  console.log("UserManagementPage session:", session);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p>User Management Page Loaded</p>
      </div>
    </>
  );
}
