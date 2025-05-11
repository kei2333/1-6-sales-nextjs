// app/api/send-sales/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const registerUrl = 'https://team6-sales-function-2.azurewebsites.net/api/send_sales';
    const res = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('売上登録に失敗');

    // 🔁 actual_amount を更新
    await fetch('https://team6-sales-function-2.azurewebsites.net/api/update_actual_amount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location_id: body.location_id,
        sales_date: body.sales_date, // YYYY-MM-DD
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("送信エラー:", e);
    return NextResponse.json({ error: '送信失敗' }, { status: 500 });
  }
}
