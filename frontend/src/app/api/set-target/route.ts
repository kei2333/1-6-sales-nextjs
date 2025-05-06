// app/api/set-target/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("受け取った目標データ:", body)

    const targetUrl = "https://team6-sales-function.azurewebsites.net/api/set_target"
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("外部APIエラー")
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (e) {
    console.error("APIエラー:", e)
    return NextResponse.json({ error: "目標の登録に失敗しました" }, { status: 500 })
  }
}
