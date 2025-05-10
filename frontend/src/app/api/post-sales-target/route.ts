import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("受け取った目標データ:", body);

    const targetUrl =
      "https://team6-sales-function-2.azurewebsites.net/api/post_sales_target";
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();

    if (!res.ok) {
      console.error(`外部APIエラー: ${res.status} - ${responseText}`);
      throw new Error(`外部APIエラー: ${res.status}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { message: responseText };
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("APIエラー:", e);
    return NextResponse.json(
      { error: "目標の登録に失敗しました" },
      { status: 500 }
    );
  }
}
