"use client";
import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function Unauthorized() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, background: "#fef2f2", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldOff size={28} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Access Denied</h1>
        <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>
          You don&apos;t have permission to access this page. Contact your administrator if you think this is a mistake.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/admin" className="btn-primary" style={{ fontSize: 14 }}>Go to Dashboard</Link>
          <Link href="/admin/login" className="btn-outline" style={{ fontSize: 14 }}>Sign In Again</Link>
        </div>
      </div>
    </div>
  );
}
