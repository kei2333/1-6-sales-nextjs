import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee?${searchParams.toString()}`;

  try {
    const res = await fetch(targetUrl, { method: 'POST' });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { message: text };
    }

    if (!res.ok) {
      return NextResponse.json({ error: json.message || 'Update failed' }, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to edit employee' }, { status: 500 });
  }
}
