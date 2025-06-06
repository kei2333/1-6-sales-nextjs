import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });

  if (!token) {
    console.warn("middleware: no token → redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "Manager") {
    console.warn("middleware: non-Manager trying to access /admin → redirect");
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};
