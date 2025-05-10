"use client";

import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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

const roleDisplayMap: { [key: string]: string } = {
  Sales: "営業",
  Manager: "管理",
  IT: "サポート",
  "権限なし": "権限なし",
};

export default function UserTable({ location_id }: { location_id: number }) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedLocationId, setEditedLocationId] = useState<number>(1);
  const [editedAddress, setEditedAddress] = useState("");

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

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

  const filteredUsers = users.filter(
    (u) =>
      u.employee_name.toLowerCase().includes(filterName.toLowerCase()) &&
      u.employee_role.toLowerCase().includes(filterRole.toLowerCase()) &&
      u.employee_address.toLowerCase().includes(filterEmail.toLowerCase())
  );

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
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="名前で検索"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="max-w-sm"
        />
        <select
          aria-label="役職で検索"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">全て</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {roleDisplayMap[r] || r}
            </option>
          ))}
        </select>
        <Input
          placeholder="メールアドレスで検索"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table className="min-w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">社員番号</TableHead>
            <TableHead className="w-40">名前</TableHead>
            <TableHead className="w-32">役職</TableHead>
            <TableHead className="w-32">拠点</TableHead>
            <TableHead className="w-56">メールアドレス</TableHead>
            <TableHead className="text-center w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
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
                        {roleDisplayMap[r] || r}
                      </option>
                    ))}
                  </select>
                ) : (
                  roleDisplayMap[user.employee_role] || user.employee_role
                )}
              </TableCell>
              <TableCell>{locationMap[user.location_id]}</TableCell>
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
