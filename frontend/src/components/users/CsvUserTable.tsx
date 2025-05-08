// components/users/CsvUserTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExportCsvButton } from "@/components/general/ExportCsvButton";
import { UserTable, User, SortConfig } from "./UserTable";

export function CsvUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("https://team6-sales-function.azurewebsites.net/api/get_employee");
      const employees = await response.json();
      const formatted = employees.map((emp: any) => ({
        id: emp.employee_number,
        name: emp.employee_name,
        role: emp.employee_role,
        email: `${emp.employee_name.replace(/\s+/g, "").toLowerCase()}@example.com`,
        updatedAt: new Date().toISOString().split("T")[0],
      }));
      setUsers(formatted);
    }

    fetchUsers();
  }, []);
  const sortedUsers = useMemo(() => {
    const sorted = [...users];
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const k = key as keyof User; // ✅ ここがポイント！
  
      sorted.sort((a, b) => {
        const aVal = a[k];
        const bVal = b[k];
  
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [users, sortConfig]);
  
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>ユーザー管理</CardTitle>
        <ExportCsvButton data={sortedUsers} filename="users.csv" />
      </CardHeader>
      <CardContent>
        <UserTable
          users={sortedUsers}
          setUsers={setUsers}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
      </CardContent>
    </Card>
  );
}
