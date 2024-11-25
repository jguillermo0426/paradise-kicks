import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const verify = req.cookies.get('loggedin');
  const { pathname } = req.nextUrl;

  // Redirect to /login if not verified and trying to access /admin-dashboard
  if (!verify && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to /admin-dashboard/inventory if already verified and accessing /login
  if (verify && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin-dashboard/inventory", req.url));
  }
}
