import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERS, SESSION_KEY } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = ADMIN_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Store role + username in session cookie as JSON
  const sessionData = JSON.stringify({ username: user.username, role: user.role, name: user.name });

  const res = NextResponse.json({ success: true, role: user.role, name: user.name });
  res.cookies.set(SESSION_KEY, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return res;
}
