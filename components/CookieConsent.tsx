"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("tp_cookies_accepted");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("tp_cookies_accepted", "true");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("tp_cookies_accepted", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 300,
      maxWidth: 420, width: "calc(100vw - 48px)",
      background: "white", border: "1px solid #e5e7eb",
      borderRadius: 14, padding: "20px 24px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
        🍪 We use cookies
      </p>
      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>
        We use cookies to improve your experience and analyze site traffic.
        See our{" "}
        <Link href="/privacy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</Link>
        {" "}for details.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={accept}
          style={{ flex: 1, padding: "9px 0", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Accept All
        </button>
        <button
          onClick={decline}
          style={{ flex: 1, padding: "9px 0", background: "white", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
