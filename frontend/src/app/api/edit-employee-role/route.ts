import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const target = `https://team6-sales-function-2.azurewebsites.net/api/edit_employee?${url.searchParams.toString()}`;

  try {
    const res = await fetch(target, { method: 'POST' });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(text);
    }

    return NextResponse.json({ message: text });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to edit employee' }, { status: 500 });
  }
}
