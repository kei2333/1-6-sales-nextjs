import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams.toString()
    const target = `https://team6-sales-function-2.azurewebsites.net/api/send_sales?${params}`

    const res = await fetch(target, { method: 'POST' })
    const data = await res.json()

    // body から location_id, sales_date, amount を抽出
    const body = Object.fromEntries(url.searchParams.entries())

    // 追加: 売上目標テーブルに actual_amount を加算する呼び出し
    await fetch('https://team6-sales-function-2.azurewebsites.net/api/add_sales_target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location_id: body.location_id,
        sales_date: body.sales_date,
        actual_amount: body.amount, // 売上金額そのまま
      }),
    })

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
