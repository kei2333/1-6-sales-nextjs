import { NextRequest, NextResponse } from 'next/server'

// モックユーザー情報 管理者と一般ユーザーのモックデータ

const mockUsers = [
  {
    employeeNumber: '12345678',
    password: 'password123',
    name: '山田 太郎',
    location: '東京本社',
    authority: '一般',
  },
  {
    employeeNumber: '87654321',
    password: 'pass4321',
    name: '佐藤 花子',
    location: '大阪支店',
    authority: '一般',
  },
  
  {
    employeeNumber: '11223344',
    password: 'password1234',
    name: '鈴木 一郎',
    location: '名古屋営業所',
    authority: '管理者',
  },

]

export async function POST(req: NextRequest) {
  const { employeeNumber, password } = await req.json()

  const user = mockUsers.find(
    (u) => u.employeeNumber === employeeNumber && u.password === password
  )

  if (user) {
    return NextResponse.json(
      {
        message: 'ログイン成功',
        user: {
          name: user.name,
          location: user.location,          
          authority: user.authority,
        },
      },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      { message: '社員番号またはパスワードが間違っています' },
      { status: 401 }
    )
  }
}
