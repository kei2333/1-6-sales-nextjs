// app/api/get-sales/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const params = url.searchParams.toString()
  const target = `https://team6-sales-function-2.azurewebsites.net/api/get_sales?${params}`

  try {
    const res = await fetch(target)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
