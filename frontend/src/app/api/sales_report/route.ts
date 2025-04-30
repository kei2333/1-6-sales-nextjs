import { NextRequest, NextResponse } from 'next/server'

// モック売上データ
const mockReports = [
  {
    id: 1,
    date: '2025-04-28',
    amount: 100000,
    memo: '展示会売上',
    category: '法人',
    location: '東京本社',
    user: '山田 太郎',
  },
  {
    id: 2,
    date: '2025-04-27',
    amount: 85000,
    memo: 'ECキャンペーン',
    category: 'EC',
    location: '東京本社',
    user: '山田 太郎',
  },
  {
    id: 3,
    date: '2025-04-26',
    amount: 90000,
    memo: '',
    category: 'エンド',
    location: '大阪支店',
    user: '佐藤 花子',
  },
]

// 🔄 GET: locationでフィルタして返す
export async function GET(req: NextRequest) {
  const location = req.nextUrl.searchParams.get('location')
  const filtered = location
    ? mockReports.filter((r) => r.location === location)
    : mockReports

  return NextResponse.json(filtered)
}

// 🆕 POST: フォーム送信データを追加（モックなので保存せず返すだけ）
export async function POST(req: NextRequest) {
  const body = await req.json()

  const newReport = {
    id: Date.now(), // 仮ID
    ...body,
  }

  return NextResponse.json(newReport, { status: 201 })
}
