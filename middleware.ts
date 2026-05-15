import { NextRequest, NextResponse } from "next/server";
import { SESSION_KEY, canAccess, type Role } from "@/lib/adminAuth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const raw = req.cookies.get(SESSION_KEY)?.value;

  // Not logged in
  if (!raw) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  let session: { username: string; role: Role; name: string } | null = null;
  try {
    session = JSON.parse(raw);
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (!session?.role) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Check permission
  if (!canAccess(session.role, pathname)) {
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }

  // Pass role info to page via headers
  const res = NextResponse.next();
  res.headers.set("x-admin-role", session.role);
  res.headers.set("x-admin-name", session.name);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
