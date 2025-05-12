// app/api/post_sales_target/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const postUrl = "https://team6-sales-function-2.azurewebsites.net/api/post_sales_target";
    const res = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    if (!res.ok) throw new Error(responseText);

    // Actual_amount を更新
    await fetch("https://team6-sales-function-2.azurewebsites.net/api/update_actual_amount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_id: body.location_id,
        sales_date: body.target_date, // YYYY-MM-DD
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("エラー:", e);
    return NextResponse.json({ error: "目標登録失敗" }, { status: 500 });
  }
}
