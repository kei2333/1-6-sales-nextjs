import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieHeader = req.headers.get("cookie");

  console.log("----- MIDDLEWARE DEBUG -----");
  console.log("pathname:", pathname);
  console.log("cookie header:", cookieHeader);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("token result:", token);
  console.log("-----------------------------");

  return NextResponse.next();  // テスト用に全部通す
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};
