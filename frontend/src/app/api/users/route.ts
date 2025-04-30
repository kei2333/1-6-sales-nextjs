import { NextResponse } from 'next/server'

// モックユーザーデータ
const mockUsers = [
  {
    id: 1,
    employeeNumber: '12345678',
    name: '山田 太郎',
    location: '東京本社',
    role: '一般',
  },
  {
    id: 2,
    employeeNumber: '87654321',
    name: '佐藤 花子',
    location: '大阪支店',
    role: '管理者',
  },
  {
    id: 3,
    employeeNumber: '11223344',
    name: '鈴木 一郎',
    location: '名古屋営業所',
    role: '一般',
  },
]

// GET: ユーザー一覧返すだけ
export async function GET() {
  return NextResponse.json(mockUsers)
}
