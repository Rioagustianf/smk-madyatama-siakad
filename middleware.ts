import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to API routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/unauthorized")) {
    return NextResponse.next();
  }

  // Allow access to login pages
  if (
    pathname.startsWith("/student/login") ||
    pathname.startsWith("/teacher/login")
  ) {
    return NextResponse.next();
  }

  // Check authentication for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }

    // For now, just check if token exists (JWT verification will be done in API routes)
    return NextResponse.next();
  }

  // Check authentication for profile page
  if (pathname.startsWith("/profile")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile"],
};
