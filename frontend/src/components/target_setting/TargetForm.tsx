'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Props = {
  onSubmit: (data: { month: string; target: number; comment: string }) => void
}

export function TargetForm({ onSubmit }: Props) {
  const [month, setMonth] = useState("")
  const [target, setTarget] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!month || !target) return
    onSubmit({ month, target: Number(target), comment })
    // オプション：初期化
    setMonth("")
    setTarget("")
    setComment("")
  }

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
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="例: 1000000"
          required
        />
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
      <Button type="submit">保存</Button>
    </form>
  )
}
