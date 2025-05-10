"use client";

import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Employee = {
  employee_number: number;
  employee_name: string;
  employee_role: string;
  location_id: number;
  employee_address: string;
};

const roleOptions = ["Sales", "IT", "Manager", "権限なし"];
const locationMap: { [key: number]: string } = {
  1: "関東", 2: "北陸", 3: "東海", 4: "近畿", 5: "中四国", 6: "九州",
};

type SortConfig = {
  key: "employee_name" | "employee_role";
  direction: "asc" | "desc";
};

export default function UserTable({ location_id }: { location_id: number }) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedLocationId, setEditedLocationId] = useState<number>(1);
  const [editedAddress, setEditedAddress] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

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

  const sortedAndFilteredUsers = () => {
    let filtered = [...users];
    if (roleFilter) {
      filtered = filtered.filter((u) => u.employee_role === roleFilter);
    }
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key].toLowerCase();
        const bVal = b[sortConfig.key].toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  };

  const toggleSort = (key: SortConfig["key"]) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const startEdit = (u: Employee) => {
    setEditingId(u.employee_number);
    setEditedName(u.employee_name);
    setEditedRole(u.employee_role);
    setEditedLocationId(u.location_id);
    setEditedAddress(u.employee_address);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setEditedRole("");
    setEditedLocationId(1);
    setEditedAddress("");
  };

  const saveEdit = async (userId: number) => {
    try {
      if (!editedName.trim() || !editedRole.trim() || !editedAddress.trim()) {
        alert("すべて入力してください。");
        return;
      }

      await fetch(`/api/update-employee-name?employee_number=${userId}&new_employee_name=${encodeURIComponent(editedName)}`, { method: "POST" });

      await fetch(`/api/edit-employee-role?employee_number=${userId}&employee_role=${encodeURIComponent(editedRole)}&location_id=${editedLocationId}&employee_address=${encodeURIComponent(editedAddress)}`, { method: "POST" });

      setUsers((prev) =>
        prev.map((u) =>
          u.employee_number === userId
            ? { ...u, employee_name: editedName, employee_role: editedRole, location_id: editedLocationId, employee_address: editedAddress }
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
    <div className="rounded-md border overflow-x-auto p-4 space-y-2">
      <Table className="min-w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">社員番号</TableHead>
            <TableHead
              className="cursor-pointer w-40"
              onClick={() => toggleSort("employee_name")}
            >
              名前
              {sortConfig?.key === "employee_name" &&
                (sortConfig.direction === "asc" ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />)}
            </TableHead>
            <TableHead className="relative w-40">
              <div className="flex items-center justify-between">
                <span
                  className="cursor-pointer"
                  onClick={() => toggleSort("employee_role")}
                >
                  役職
                  {sortConfig?.key === "employee_role" &&
                    (sortConfig.direction === "asc" ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />)}
                </span>
                <button
                  className="ml-2 text-gray-500 hover:text-black"
                  onClick={() => setFilterVisible(!filterVisible)}
                  aria-label="フィルターを開く"
                >
                  <Filter size={16} />
                </button>
              </div>
              {filterVisible && (
                <div className="absolute bg-white border p-2 shadow-lg z-10 mt-1 rounded right-0 w-40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">役職フィルター</span>
                    <button
                      onClick={() => {
                        setRoleFilter("");
                        setFilterVisible(false);
                      }}
                      className="text-xs text-gray-500 hover:text-black"
                      aria-label="閉じる"
                    >
                      ×
                    </button>
                  </div>
                  <select
                    aria-label="役職フィルター"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">全て</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </TableHead>
            <TableHead className="w-32">拠点</TableHead>
            <TableHead className="w-56">メールアドレス</TableHead>
            <TableHead className="text-center w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredUsers().map((user) => (
            <TableRow key={user.employee_number}>
              <TableCell>{user.employee_number}</TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                ) : (
                  user.employee_name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    aria-label="役職を選択"
                    className="border rounded px-2 py-1 w-full"
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
                    onChange={(e) => setEditedLocationId(Number(e.target.value))}
                    aria-label="拠点を選択"
                    className="border rounded px-2 py-1 w-full"
                  >
                    {Object.entries(locationMap).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  locationMap[user.location_id]
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} />
                ) : (
                  <span className="truncate max-w-[200px]" title={user.employee_address}>
                    {user.employee_address}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted" aria-label="操作メニュー">
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {editingId === user.employee_number ? (
                      <>
                        <DropdownMenuItem onClick={() => saveEdit(user.employee_number)}>保存</DropdownMenuItem>
                        <DropdownMenuItem onClick={cancelEdit}>キャンセル</DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => startEdit(user)}>編集</DropdownMenuItem>
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
