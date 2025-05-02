// app/api/send-sales/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const params = url.searchParams.toString()
  const target = `https://team6-sales-function.azurewebsites.net/api/send_sales?${params}`

  try {
    const res = await fetch(target, { method: 'POST' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
