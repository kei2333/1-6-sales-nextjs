"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// バッジのロールマップ
const roleMap: { [key: string]: string } = {
  employee: "従業員",
  admin: "管理者",
  executive: "経営部門",
};

// モックデータ
const initialUsers = [
  {
    id: 1,
    name: "佐藤 太郎",
    department: "営業",
    role: "employee",
    email: "sato@example.com",
    updatedAt: "2024-05-01",
  },
  {
    id: 2,
    name: "田中 花子",
    department: "管理",
    role: "executive",
    email: "tanaka@example.com",
    updatedAt: "2024-04-30",
  },
  {
    id: 3,
    name: "高橋 次郎",
    department: "サポート",
    role: "admin",
    email: "takahashi@example.com",
    updatedAt: "2024-04-28",
  },
];

export default function UserTable() {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");

  const startEdit = (userId: number, currentName: string) => {
    setEditingId(userId);
    setEditedName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedName("");
  };

  const saveEdit = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: editedName, updatedAt: new Date().toISOString().split("T")[0] }
          : user
      )
    );
    cancelEdit();
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
                  {roleMap[user.role]}
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
