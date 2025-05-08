import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// セッションの確認とリダイレクト処理
export async function middleware(req: NextRequest) {
  // セッション情報の取得
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ログインしていない場合、ログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ページアクセス制限
  const pathname = req.nextUrl.pathname;

  // 管理者ページ(/admin)にアクセスする際のチェック
  if (pathname.startsWith("/admin") && token.role !== "Manager" && token.role !== "IT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // セールスページ(/sales)にアクセスする際のチェック
  if (pathname.startsWith("/sales") && token.role !== "Sales") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // セールスページ(/users)にアクセスする際のチェック
  if (pathname.startsWith("/users") && token.role !== "IT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 他のページアクセスの場合、問題なければそのまま進む
  return NextResponse.next();
}

// 適用するパスを指定
export const config = {
  matcher: ["/admin", "/sales", "/users"], // /dashboard は削除しました
};
