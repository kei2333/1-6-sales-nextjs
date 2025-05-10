"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

type Employee = {
  employee_number: number;
  employee_name: string;
  employee_role: string;
  location_id: number;
  employee_address: string;
};

const roleOptions = ["Sales", "IT", "Manager", "権限なし"];
const locationMap: { [key: number]: string } = {
  1: "関東",
  2: "北陸",
  3: "東海",
  4: "近畿",
  5: "中四国",
  6: "九州",
};

type SortConfig = {
  key: keyof Employee;
  direction: "asc" | "desc";
};

export default function UserTable({ location_id }: { location_id: number }) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedLocationId, setEditedLocationId] = useState<number>(1);
  const [editedAddress, setEditedAddress] = useState("");

  const [filterVisible, setFilterVisible] = useState<Record<keyof Employee, boolean>>({
    employee_number: false,
    employee_name: false,
    employee_role: false,
    location_id: false,
    employee_address: false,
  });
  const [filters, setFilters] = useState<Record<keyof Employee, string>>({
    employee_number: "",
    employee_name: "",
    employee_role: "",
    location_id: "",
    employee_address: "",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/get-employee");
        const employees: Employee[] = await res.json();
        const filtered =
          location_id === 0
            ? employees
            : employees.filter((u) => u.location_id === location_id);
        setUsers(filtered);
      } catch (e) {
        console.error("データ取得エラー:", e);
      }
    }
    fetchUsers();
  }, [location_id]);

  const toggleSort = (key: keyof Employee) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const handleFilterChange = (key: keyof Employee, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const sortedAndFilteredUsers = () => {
    let filtered = users.filter((u) =>
      (Object.keys(filters) as (keyof Employee)[]).every((key) =>
        u[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
      )
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  };

  const startEdit = (user: Employee) => {
    setEditingId(user.employee_number);
    setEditedName(user.employee_name);
    setEditedRole(user.employee_role);
    setEditedLocationId(user.location_id);
    setEditedAddress(user.employee_address);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setEditedRole("");
    setEditedLocationId(1);
    setEditedAddress("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") cancelEdit();
  };

  const saveEdit = async (userId: number) => {
    try {
      if (!editedName.trim() || !editedRole.trim() || !editedAddress.trim()) {
        alert("すべての項目を入力してください。");
        return;
      }

      const nameRes = await fetch(
        `/api/update-employee-name?employee_number=${userId}&new_employee_name=${encodeURIComponent(
          editedName
        )}`,
        { method: "POST" }
      );

      const roleRes = await fetch(
        `/api/edit-employee-role?employee_number=${userId}&employee_role=${encodeURIComponent(
          editedRole
        )}&location_id=${editedLocationId}&employee_address=${encodeURIComponent(
          editedAddress
        )}`,
        { method: "POST" }
      );

      if (!nameRes.ok || !roleRes.ok) throw new Error("更新失敗");

      setUsers((prev) =>
        prev.map((u) =>
          u.employee_number === userId
            ? {
                ...u,
                employee_name: editedName,
                employee_role: editedRole,
                location_id: editedLocationId,
                employee_address: editedAddress,
              }
            : u
        )
      );
      cancelEdit();
    } catch (e) {
      console.error("保存エラー:", e);
      alert("保存に失敗しました。");
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto p-2 space-y-2">
      <Table className="min-w-full text-sm">
        <TableHeader>
          <TableRow>
            {[
              { key: "employee_number", label: "社員番号" },
              { key: "employee_name", label: "名前" },
              { key: "employee_role", label: "役職" },
              { key: "location_id", label: "拠点" },
              { key: "employee_address", label: "メールアドレス" },
            ].map(({ key, label }) => (
              <TableHead
                key={key}
                className="cursor-pointer"
                onClick={() =>
                  key !== "employee_number" && toggleSort(key as keyof Employee)
                }
              >
                <div className="flex items-center">
                  {label}
                  {sortConfig?.key === key && (
                    <>
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </>
                  )}
                  <button
                    className="ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterVisible((prev) => ({
                        ...prev,
                        [key as keyof Employee]: !prev[key as keyof Employee],
                      }));
                    }}
                    aria-label="フィルターを開く"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {filterVisible[key as keyof Employee] && (
                  <Input
                    placeholder={`${label}でフィルター`}
                    value={filters[key as keyof Employee] || ""}
                    onChange={(e) =>
                      handleFilterChange(key as keyof Employee, e.target.value)
                    }
                    className="mt-1"
                  />
                )}
              </TableHead>
            ))}
            <TableHead className="text-center w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredUsers().map((user) => (
            <TableRow
              key={user.employee_number}
              onKeyDown={handleKeyDown}
              className="hover:bg-gray-100 transition-colors"
            >
              <TableCell>{user.employee_number}</TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  user.employee_name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    aria-label="役職を選択"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.employee_role
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <select
                    value={editedLocationId}
                    onChange={(e) =>
                      setEditedLocationId(Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 w-full"
                    aria-label="拠点を選択"
                  >
                    {Object.entries(locationMap).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  locationMap[user.location_id] || `ID: ${user.location_id}`
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                  />
                ) : (
                  <span
                    className="truncate max-w-[200px]"
                    title={user.employee_address}
                  >
                    {user.employee_address}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1 rounded hover:bg-muted"
                      aria-label="操作メニュー"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {editingId === user.employee_number ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => saveEdit(user.employee_number)}
                        >
                          保存
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={cancelEdit}>
                          キャンセル
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => startEdit(user)}>
                        編集
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
