// app/api/edit-employee-role/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const target = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee_role?${url.searchParams.toString()}`

  try {
    const res = await fetch(target, { method: 'POST' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to edit role' }, { status: 500 })
  }
}