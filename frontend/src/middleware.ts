import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  if (!token || typeof token.role !== "string" || token.role === "権限なし") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "Manager") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/sales") && token.role !== "Sales") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/users") && token.role !== "IT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};
