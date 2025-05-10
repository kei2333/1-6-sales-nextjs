//components/user/UserTable.tsx
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
import { MoreHorizontal } from "lucide-react";
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

export default function UserTable({ location_id }: { location_id: number }) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedLocationId, setEditedLocationId] = useState<number>(1);
  const [editedAddress, setEditedAddress] = useState("");

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>社員番号</TableHead>
            <TableHead>名前</TableHead>
            <TableHead>役職</TableHead>
            <TableHead>拠点</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.employee_number} onKeyDown={handleKeyDown}>
              <TableCell>{user.employee_number}</TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-40"
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
                    className="border rounded px-2 py-1"
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
                    onChange={(e) => setEditedLocationId(Number(e.target.value))}
                    className="border rounded px-2 py-1"
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
                    className="w-52"
                  />
                ) : (
                  user.employee_address
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
