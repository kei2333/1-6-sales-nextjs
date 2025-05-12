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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type Employee = {
  employee_number: number;
  employee_name: string;
  employee_role: string;
  location_id: number;
  employee_address: string;
};

const roleOptions = ["Sales", "IT", "Manager", "権限なし"];
const roleDisplayMap: { [key: string]: string } = {
  Sales: "営業",
  IT: "サポート",
  Manager: "管理",
  権限なし: "権限なし",
};
const locationOptions: { [key: number]: string } = {
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
  const [editedEmailError, setEditedEmailError] = useState("");

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployeeNumber, setNewEmployeeNumber] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("Sales");
  const [newLocationId, setNewLocationId] = useState(1);
  const [newEmployeeAddress, setNewEmployeeAddress] = useState("");
  const [newEmailError, setNewEmailError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    setEditedEmailError("");
  };

  const cancelEdit = () => {
    if (
      window.confirm("編集をキャンセルしてもよいですか？内容は破棄されます。")
    ) {
      setEditingId(null);
      setEditedName("");
      setEditedRole("");
      setEditedLocationId(1);
      setEditedAddress("");
      setEditedEmailError("");
    }
  };

  const saveEdit = async (userId: number) => {
    if (!window.confirm("この内容で保存しますか？")) return;

    if (!emailRegex.test(editedAddress)) {
      setEditedEmailError("有効なメールアドレス形式を入力してください。");
      return;
    }

    try {
      if (!editedName.trim() || !editedRole.trim() || !editedAddress.trim()) {
        alert("すべて入力してください。");
        return;
      }

      const params = new URLSearchParams({
        employee_number: userId.toString(),
        employee_name: editedName,
        employee_role: editedRole,
        employee_address: editedAddress,
        location_id: editedLocationId.toString(),
      });

      const res = await fetch(`/api/edit-employee?${params.toString()}`, {
        method: "POST",
      });

      if (!res.ok) {
        const result = await res.text();
        throw new Error(result || "更新失敗");
      }

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

      setEditingId(null);
      setEditedName("");
      setEditedRole("");
      setEditedLocationId(1);
      setEditedAddress("");
      setEditedEmailError("");

      alert("保存が完了しました。");
    } catch (e) {
      console.error("保存エラー:", e);
      alert("保存に失敗しました。");
    }
  };

  const handleAddUser = async () => {
    if (!emailRegex.test(newEmployeeAddress)) {
      setNewEmailError("有効なメールアドレス形式を入力してください。");
      return;
    }

    try {
      if (
        !newEmployeeNumber.trim() ||
        !newEmployeeName.trim() ||
        !newEmployeeRole.trim() ||
        !newEmployeeAddress.trim()
      ) {
        alert("すべて入力してください。");
        return;
      }

      const params = new URLSearchParams({
        employee_number: newEmployeeNumber,
        employee_name: newEmployeeName,
        employee_role: newEmployeeRole,
        employee_address: newEmployeeAddress,
        location_id: newLocationId.toString(),
      });

      const res = await fetch(`/api/add-employee?${params.toString()}`, {
        method: "POST",
      });

      if (!res.ok) {
        const result = await res.text();
        throw new Error(result || "登録失敗");
      }

      const newUser: Employee = {
        employee_number: Number(newEmployeeNumber),
        employee_name: newEmployeeName,
        employee_role: newEmployeeRole,
        location_id: newLocationId,
        employee_address: newEmployeeAddress,
      };

      setUsers((prev) => [...prev, newUser]);

      setNewEmployeeNumber("");
      setNewEmployeeName("");
      setNewEmployeeRole("Sales");
      setNewLocationId(1);
      setNewEmployeeAddress("");
      setNewEmailError("");

      setDialogOpen(false);

      alert("新規登録が完了しました。");
    } catch (e) {
      console.error("登録エラー:", e);
      alert("登録に失敗しました。");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setNewEmployeeNumber("");
      setNewEmployeeName("");
      setNewEmployeeRole("Sales");
      setNewLocationId(1);
      setNewEmployeeAddress("");
      setNewEmailError("");
    }
    setDialogOpen(open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto p-4 space-y-4">
      <div className="flex gap-4">
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

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-lime-500 hover:bg-lime-600 text-white">
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>新規従業員を追加</DialogTitle>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="社員番号 (半角数字)"
                value={newEmployeeNumber}
                onChange={(e) =>
                  setNewEmployeeNumber(e.target.value.replace(/\D/g, ""))
                }
              />
              <Input
                type="text"
                placeholder="名前"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
              />
              <select
                value={newEmployeeRole}
                onChange={(e) => setNewEmployeeRole(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {roleDisplayMap[r] || r}
                  </option>
                ))}
              </select>
              <select
                value={newLocationId}
                onChange={(e) => setNewLocationId(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
              >
                {Object.entries(locationOptions).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                placeholder="メールアドレス (半角)"
                value={newEmployeeAddress}
                onChange={(e) =>
                  setNewEmployeeAddress(
                    e.target.value.replace(/[^\x20-\x7E]/g, "")
                  )
                }
              />
              {newEmailError && (
                <p className="text-red-500 text-sm">{newEmailError}</p>
              )}
              <Button
                onClick={handleAddUser}
                className="bg-lime-500 hover:bg-lime-600 text-white w-full"
              >
                登録
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <TableRow
              key={user.employee_number}
              onKeyDown={handleKeyDown}
              className="hover:bg-gray-100 transition-colors"
            >
              <TableCell>{user.employee_number}</TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
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
                    className="border rounded px-2 py-1 w-full"
                    aria-label="役職を選択"
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
              <TableCell>
                {editingId === user.employee_number ? (
                  <select
                    value={editedLocationId}
                    onChange={(e) =>
                      setEditedLocationId(Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 w-full"
                    aria-label="拠点を選択"
                  >
                    {Object.entries(locationOptions).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  locationOptions[user.location_id] || `ID: ${user.location_id}`
                )}
              </TableCell>
              <TableCell>
                {editingId === user.employee_number ? (
                  <Input
                    value={editedAddress}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\x20-\x7E]/g, "");
                      setEditedAddress(val);
                      setEditedEmailError(
                        emailRegex.test(val)
                          ? ""
                          : "有効なメールアドレス形式を入力してください。"
                      );
                    }}
                  />
                ) : (
                  <span
                    className="truncate max-w-[200px]"
                    title={user.employee_address}
                  >
                    {user.employee_address}
                  </span>
                )}
                {editingId === user.employee_number && editedEmailError && (
                  <p className="text-red-500 text-sm">{editedEmailError}</p>
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
