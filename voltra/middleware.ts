import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const userRole = request.cookies.get("userRole")?.value;

  // User is not logged in
  if (!accessToken) {
    const loginUrl = new URL("/auth", request.url);

    return NextResponse.redirect(loginUrl);
  }

  // Only ADMIN can access /admin
    if (
        request.nextUrl.pathname.startsWith("/admin") &&
        userRole !== "ADMIN"
    ) {
        const stationUrl = new URL("/stationPage", request.url);

        return NextResponse.redirect(stationUrl);
    }

  // User is logged in
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/stationPage/:path*",
    "/bookingPage/:path*",
    "/bookingsPage/:path*",
    "/payment/:path*",
    "/profilePage/:path*",
    "/admin/:path*",
  ],
};