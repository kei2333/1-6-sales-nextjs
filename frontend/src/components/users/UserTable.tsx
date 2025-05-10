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
};

type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  updatedAt: string;
  location_id: number;
};

type Props = {
  location_id: number;
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

export default function UserTable({ location_id }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/get-employee");
        const employees: Employee[] = await res.json();

        const formatted: User[] = employees.map((e) => ({
          id: e.employee_number,
          name: e.employee_name,
          role: e.employee_role,
          email: `${e.employee_name.replace(/\s+/g, "")}@example.com`,
          updatedAt: new Date().toISOString().split("T")[0],
          location_id: e.location_id,
        }));

        setUsers(
          location_id === 0
            ? formatted
            : formatted.filter((u) => u.location_id === location_id)
        );
      } catch (e) {
        console.error("データ取得エラー:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [location_id]);

  const startEdit = (id: number, name: string, role: string) => {
    setEditingId(id);
    setEditedName(name);
    setEditedRole(role);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setEditedRole("");
  };

  const saveEdit = async (userId: number) => {
    try {
      if (!editedName.trim() || !editedRole.trim()) {
        alert("名前と役職を入力してください。");
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
        )}`,
        { method: "POST" }
      );

      if (!nameRes.ok || !roleRes.ok) throw new Error("更新失敗");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, name: editedName, role: editedRole } : u
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
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-40"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
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
                  user.role
                )}
              </TableCell>
              <TableCell>
                {locationMap[user.location_id] || `ID: ${user.location_id}`}
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
                    {editingId === user.id ? (
                      <>
                        <DropdownMenuItem onClick={() => saveEdit(user.id)}>
                          保存
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={cancelEdit}>
                          キャンセル
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            startEdit(user.id, user.name, user.role)
                          }
                        >
                          編集
                        </DropdownMenuItem>
                      </>
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
