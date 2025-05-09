import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("middleware token raw:", token);

  // 一旦、token があれば通過、なくても通過（完全にフリー）
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};
