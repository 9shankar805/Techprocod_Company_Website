import { NextResponse } from "next/server";
import { SESSION_KEY } from "@/lib/adminAuth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_KEY);
  return res;
}
