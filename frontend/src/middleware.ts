import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const ageConfirmed = request.cookies.get("ageConfirmed")?.value;
  const { pathname } = request.nextUrl;

  // Age gate check
  if (!ageConfirmed && !pathname.startsWith("/age-gate")) {
    return NextResponse.redirect(new URL("/age-gate", request.url));
  }

  // Protect /profile (auth required)
  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from accessing /login or /register
  if (
    token &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // apply globally except assets
  ],
};
