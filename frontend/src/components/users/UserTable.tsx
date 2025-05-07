"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// バッジのロールマップ
const roleMap: { [key: string]: string } = {
  employee: "従業員",
  admin: "管理者",
  executive: "経営部門",
  sales: "営業",
  support: "サポート",
};

// 後端からのデータ型定義
interface Employee {
  employee_number: string;
  employee_name: string;
  location_id: number;
  employee_role: string;
}

// フロントエンド用のユーザー型定義
interface User {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  updatedAt: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    // APIからデータを取得する
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://team6-sales-function.azurewebsites.net/api/get_employee');
        
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        
        const employees: Employee[] = await response.json();
        
        // APIからのデータをフロントエンド用に変換
        const formattedUsers: User[] = employees.map(emp => ({
          id: emp.employee_number,
          name: emp.employee_name,
          department: getDepartmentByRole(emp.employee_role),
          role: emp.employee_role,
          email: `${emp.employee_name.replace(/\s+/g, '').toLowerCase()}@example.com`,
          updatedAt: new Date().toISOString().split('T')[0],
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

  // 役職から部署を取得する関数
  function getDepartmentByRole(role: string): string {
    const departmentMap: Record<string, string> = {
      'admin': '管理',
      'sales': '営業',
      'support': 'サポート',
      'executive': '経営部門',
      'employee': '一般'
    };
    return departmentMap[role] || '一般';
  }

  const startEdit = (userId: string, currentName: string) => {
    setEditingId(userId);
    setEditedName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
  };

  const saveEdit = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: editedName, updatedAt: new Date().toISOString().split("T")[0] }
          : user
      )
    );
    cancelEdit();
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  if (loading) {
    return <div className="p-4 text-center">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>部署</TableHead>
            <TableHead>役職</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>最終更新</TableHead>
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
              <TableCell>{user.department}</TableCell>
              <TableCell>
                <span className="inline-block px-3 py-1 border rounded-full text-sm">
                  {roleMap[user.role] || user.role}
                </span>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.updatedAt}</TableCell>
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
                        <DropdownMenuItem onClick={() => startEdit(user.id, user.name)}>
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
