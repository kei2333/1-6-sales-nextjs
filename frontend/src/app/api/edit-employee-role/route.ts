import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const target = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee_role`;

    const res = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Failed to edit role:', e);
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
  }
}
