// app/api/edit-employee/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee?${searchParams.toString()}`;

  try {
    const res = await fetch(target, { method: 'POST' });

    // ここは res.text() にして、レスポンスが JSON でない場合に備える
    const text = await res.text();

    // 試しにJSONとしてパースできるか確認
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to edit employee' }, { status: 500 });
  }
}
