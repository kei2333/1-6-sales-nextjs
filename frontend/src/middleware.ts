import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieHeader = req.headers.get("cookie");

  console.log("middleware: pathname =", pathname);
  console.log("middleware: cookie header =", cookieHeader);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("middleware: token =", token);

  // 全通し（テスト用）
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};
