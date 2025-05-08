// app/api/get-target/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const branch = url.searchParams.get("branch") ?? "all"

  try {
    const targetUrl = `https://team6-sales-function.azurewebsites.net/api/get_target?branch=${branch}`
    const res = await fetch(targetUrl)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("目標データ取得失敗:", err)
    return NextResponse.json({ error: "取得失敗" }, { status: 500 })
  }
}
