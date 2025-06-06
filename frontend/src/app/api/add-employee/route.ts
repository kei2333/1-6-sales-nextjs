// app/api/add-employee/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const target = `https://team6-sales-function-2.azurewebsites.net/api/add_employee?${url.searchParams.toString()}`;

  try {
    const res = await fetch(target, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}
