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

// モックAPIデータに対応
const initialUsers = [
  { id: 0, name: "木村健太郎", location_id: 1, role: "IT" },
  { id: 1, name: "田中健太郎", location_id: 2, role: "Sales" },
  { id: 2, name: "清水翔太", location_id: 3, role: "Sales" },
  { id: 3, name: "佐倉健太郎", location_id: 2, role: "IT" },
  { id: 4, name: "吉田誠", location_id: 2, role: "IT" },
  { id: 5, name: "木村健太郎", location_id: 4, role: "Manager" },
];

const roleOptions = ["Sales", "IT", "Manager"];

export default function UserTable() {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedRole, setEditedRole] = useState("");

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

  const saveEdit = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: editedName, role: editedRole }
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
