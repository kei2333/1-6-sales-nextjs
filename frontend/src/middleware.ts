import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.warn("middleware: skipping all checks");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/users/:path*"],
};

