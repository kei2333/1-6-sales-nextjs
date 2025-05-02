import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salesDate = searchParams.get('sales_date');
  const locationId = searchParams.get('location_id');

  if (!salesDate || !locationId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const targetUrl = `https://team6-sales-function.azurewebsites.net/api/get_sales?sales_date=${salesDate}&location_id=${locationId}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 });
  }
}
