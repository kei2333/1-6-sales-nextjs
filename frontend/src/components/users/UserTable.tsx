"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useEffect } from "react";

type Employee = {  employee_number: number;  employee_name: string;  employee_role: string;  location_id: number;};
type User = {  id: number;  name: string;  role: string;  email: string;  updatedAt: string;};



const roleOptions = ["Sales", "IT", "Manager","権限なし"];

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch("https://team6-sales-function.azurewebsites.net/api/get_employee");
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        const employees: Employee[] = await response.json();

        const formattedUsers: User[] = employees.map((emp) => ({
          id: emp.employee_number,
          name: emp.employee_name,
          role: emp.employee_role,
          email: `${emp.employee_name.replace(/\s+/g, "").toLowerCase()}@example.com`,
          updatedAt: new Date().toISOString().split("T")[0],
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("ユーザーデータの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  

  const startEdit = (userId: number, currentName: string, currentRole: string) => {
    setEditingId(userId);
    setEditedName(currentName);
    setEditedRole(currentRole);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
    setEditedRole("");
  };

  const saveEdit = async (userId: number) => {
    try {
      // 名前の更新（GETやPOSTどちらでも可。API仕様に合わせる）
      const nameUrl = `https://team6-sales-function.azurewebsites.net/api/update_employee_name?employee_number=${userId}&new_employee_name=${encodeURIComponent(editedName)}`;
      const nameResponse = await fetch(nameUrl, { method: "POST" });
  
      if (!nameResponse.ok) {
        throw new Error("名前の更新に失敗しました");
      }
  
      // 役職の更新
      const roleUrl = `https://team6-sales-function.azurewebsites.net/api/edit_employee_role?employee_number=${userId}&new_employee_role=${encodeURIComponent(editedRole)}`;
      const roleResponse = await fetch(roleUrl, { method: "POST" });
  
      if (!roleResponse.ok) {
        throw new Error("役職の更新に失敗しました");
      }
  
      // フロントエンド状態更新
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, name: editedName, role: editedRole }
            : user
        )
      );
      cancelEdit();
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました。");
    }
  };

  const deleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>役職</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
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
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted">
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {editingId === user.id ? (
                      <>
                        <DropdownMenuItem onClick={() => saveEdit(user.id)}>
                          保存
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={cancelEdit}>キャンセル</DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => startEdit(user.id, user.name, user.role)}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}