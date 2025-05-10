"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  onSubmit: (data: {
    month: string;
    target: number;
    comment: string;
  }) => Promise<boolean>;
};

export function TargetForm({ onSubmit }: Props) {
  const [month, setMonth] = useState("");
  const [target, setTarget] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!month || !target) return;

    if (!/^\d+$/.test(target)) {
      setError("目標金額は半角数字のみ入力してください。");
      return;
    }

    setError("");

    const success = await onSubmit({ month, target: Number(target), comment });

    if (success) {
      alert("保存に成功しました！");
      setMonth("");
      setTarget("");
      setComment("");
    } else {
      alert("保存に失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="month">対象年月</Label>
        <Input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="target">目標金額</Label>
        <Input
          id="target"
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="例: 1000000"
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <Label htmlFor="comment">備考（任意）</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="補足など"
        />
      </div>
      <Button
        type="submit"
        style={{ backgroundColor: "#88e100", color: "black" }}
      >
        保存
      </Button>
    </form>
  );
}
