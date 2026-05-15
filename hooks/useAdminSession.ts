"use client";
import { useState, useEffect } from "react";
import type { Role } from "@/lib/adminAuth";

interface AdminSession {
  role: Role;
  name: string;
  username: string;
  loading: boolean;
}

export function useAdminSession(): AdminSession {
  const [session, setSession] = useState<AdminSession>({ role: "support", name: "", username: "", loading: true });

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.role) setSession({ role: d.role, name: d.name, username: d.username, loading: false });
      })
      .catch(() => setSession((p) => ({ ...p, loading: false })));
  }, []);

  return session;
}
