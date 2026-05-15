import { cookies } from "next/headers";
import { SESSION_KEY, type Role } from "@/lib/adminAuth";

export interface Session {
  username: string;
  role: Role;
  name: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}
