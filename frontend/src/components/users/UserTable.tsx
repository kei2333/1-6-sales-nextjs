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

type Location = {
  location_id: number;

}


const roleOptions = ["Sales", "IT", "Manager","権限なし"];

export default function UserTable({ location_id }: Location) {
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(false);
  // Removed unused error state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch("https://team6-sales-function-2.azurewebsites.net/api/get_employee");
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
          location_id: emp.location_id,
        }));
        if (location_id !== 0) {
          const filteredUsers = formattedUsers.filter((user) => user.location_id === location_id);
          setUsers(filteredUsers);
        } else {
          setUsers(formattedUsers);
        }
      } catch (err) {
        console.error("データ取得エラー:", err);
        console.error("ユーザーデータの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [location_id]);

  

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
      console.log("=== 保存処理開始 ===");
      console.log("User ID:", userId);
      console.log("Edited Name:", editedName);
      console.log("Edited Role:", editedRole);
  
      // 빈 값 확인
      if (!editedName.trim() || !editedRole.trim()) {
        alert("名前と役職を入力してください。");
        return;
      }
  
      // 이름 변경 API
      const nameUrl = `https://team6-sales-function-2.azurewebsites.net/api/update_employee_name?employee_number=${userId}&new_employee_name=${encodeURIComponent(editedName)}`;
      console.log("名前API URL:", nameUrl);
  
      const nameResponse = await fetch(nameUrl, { method: "POST" });
      if (!nameResponse.ok) {
        throw new Error("名前の更新に失敗しました");
      }
  
      // 권한 변경 API
      const roleUrl = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee_role?employee_number=${userId}&employee_role=${encodeURIComponent(editedRole)}`;
      console.log("役職API URL:", roleUrl);
  
      const roleResponse = await fetch(roleUrl, { method: "POST" });
      if (!roleResponse.ok) {
        throw new Error("役職の更新に失敗しました");
      }
  
      // 상태 업데이트
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, name: editedName, role: editedRole }
            : user
        )
      );
      cancelEdit();
      console.log("=== 保存完了 ===");
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
            <TableHead>社員番号</TableHead>
            <TableHead>名前</TableHead>
            <TableHead>役職</TableHead>
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
              <TableCell className="text-center">
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