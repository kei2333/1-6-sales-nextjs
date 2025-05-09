// app/api/get-employee/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const target = `https://team6-sales-function-2.azurewebsites.net/api/get_employee`

  try {
    const res = await fetch(target)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 })
  }
}
