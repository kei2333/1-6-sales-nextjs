import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
 
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 
  const pathname = req.nextUrl.pathname;
 
  // ログインしていない、または role がない／権限なしの場合、ログインページへリダイレクト
  if (!token || typeof token.role !== "string" || token.role === "権限なし") {
    console.warn("middleware: no valid token or role → redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
 
  // 管理者ページ (/admin) → Managerのみ許可
  if (pathname.startsWith("/admin") && token.role !== "Manager") {
    console.warn("middleware: non-Manager trying to access /admin → redirect");
    return NextResponse.redirect(new URL("/login", req.url));
  }
 
  // セールスページ (/sales) → Salesのみ許可
  if (pathname.startsWith("/sales") && token.role !== "Sales") {
    console.warn("middleware: non-Sales trying to access /sales → redirect");
    return NextResponse.redirect(new URL("/login", req.url));
  }
 
  // ユーザーページ (/users) → ITのみ許可
  if (pathname.startsWith("/users") && token.role !== "IT") {
    console.warn("middleware: non-IT trying to access /users → redirect");
    return NextResponse.redirect(new URL("/login", req.url));
  }
 
  console.log("middleware: access allowed to", pathname);
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};