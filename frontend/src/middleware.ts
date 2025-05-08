import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// セッションの確認とリダイレクト処理
export async function middleware(req: NextRequest) {
  // セッション情報の取得
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ログインしていない、または権限なしの場合、ログインページにリダイレクト
  if (!token || !token.role || token.role === "権限なし") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ページアクセス制限
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 他のページアクセスの場合、問題なければそのまま進む
  return NextResponse.next();
}

// 適用するパスを指定
export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"], 
};
