// app/api/get-target/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const locationId = url.searchParams.get("location_id") ?? "all"

  try {
    const targetUrl = `https://team6-sales-function-2.azurewebsites.net/api/get_sales_target?location_id=${locationId}`
    const res = await fetch(targetUrl)

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Azure側エラー: ${res.status} - ${errorText}`)
      return NextResponse.json({ error: `Azure側エラー: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("目標データ取得失敗:", err)
    return NextResponse.json({ error: `取得失敗: ${err}` }, { status: 500 })
  }
}
