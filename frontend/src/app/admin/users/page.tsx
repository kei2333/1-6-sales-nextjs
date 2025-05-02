// app/admin/users/page.tsx
"use client";


export default function UserManagementPage() {
  return (
    <main className="flex-1 p-6 overflow-auto">
      <PageHeader title="従業員一覧" />

      <div className="flex items-center justify-between mb-4">
        <UserSearchBar />
      </div>

      <UserTable />
    </main>
  );
}
