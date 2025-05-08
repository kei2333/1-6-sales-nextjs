// components/users/UserTable.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  updatedAt: string;
};

export type SortConfig = {
  key: keyof User;
  direction: "asc" | "desc";
} | null;

type Props = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sortConfig: SortConfig;
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>; // ✅ 修正
};

export function UserTable({
  users,
  setUsers,
  sortConfig,
  setSortConfig,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

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

  const saveEdit = async (id: number) => {
    if (!editedName.trim() || !editedRole.trim()) {
      alert("名前と役職を入力してください");
      return;
    }

    try {
      const nameUrl = `https://team6-sales-function.azurewebsites.net/api/update_employee_name?employee_number=${id}&new_employee_name=${encodeURIComponent(editedName)}`;
      const roleUrl = `https://team6-sales-function.azurewebsites.net/api/edit_employee_role?employee_number=${id}&employee_role=${encodeURIComponent(editedRole)}`;

      const nameRes = await fetch(nameUrl, { method: "POST" });
      const roleRes = await fetch(roleUrl, { method: "POST" });

      if (!nameRes.ok || !roleRes.ok) throw new Error("保存エラー");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, name: editedName, role: editedRole }
            : user
        )
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    }
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleSort = (key: keyof User) => {
    setSortConfig((prev): SortConfig => {
      const newDirection =
        prev?.key === key && prev.direction === "asc" ? "desc" : "asc";

      return {
        key,
        direction: newDirection as "asc" | "desc",
      };
    });
  };

  const renderArrow = (key: keyof User) => {
    if (sortConfig?.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <table className="w-full text-sm border">
      <thead className="bg-lime-200">
        <tr>
          <th className="p-2 cursor-pointer" onClick={() => handleSort("name")}>
            名前 {renderArrow("name")}
          </th>
          <th className="p-2 cursor-pointer" onClick={() => handleSort("role")}>
            役職 {renderArrow("role")}
          </th>
          <th className="p-2 text-right">操作</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b even:bg-lime-50">
            <td className="p-2">
              {editingId === user.id ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                user.name
              )}
            </td>
            <td className="p-2">
              {editingId === user.id ? (
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {["Sales", "IT", "Manager", "権限なし"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              ) : (
                user.role
              )}
            </td>
            <td className="p-2 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={18} />
                  </Button>
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
                      <DropdownMenuItem onClick={() => deleteUser(user.id)}>
                        削除
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
