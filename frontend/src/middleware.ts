import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// セッションの確認とリダイレクト処理
export async function middleware(req: NextRequest) {
  // 開発中は認証チェックを無効にする場合
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 開発時に制限なしでアクセス許可
  const pathname = req.nextUrl.pathname;

  // 認証なしでもアクセス可能にする場合
  if (pathname.startsWith("/admin") || pathname.startsWith("/sales") || pathname.startsWith("/users")) {
    return NextResponse.next(); // 管理者ページ、セールス、ユーザーページは制限なし
  }

  // 通常の認証チェック
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ログインしていない場合、ログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ページアクセス制限（例: `/admin` など）
  if (pathname.startsWith("/admin") && token.role !== "Manager" && token.role !== "IT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/sales") && token.role !== "Sales") {
    console.warn("middleware: non-Sales trying to access /sales → redirect");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/users") && token.role !== "IT") {
    console.warn("middleware: non-IT trying to access /users → redirect");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 他のページアクセスの場合、問題なければそのまま進む
  return NextResponse.next();
}

// 適用するパスを指定
export const config = {
  matcher: ["/admin", "/sales", "/users"], // 管理者、セールス、ユーザーページにアクセスを制限
}; 

