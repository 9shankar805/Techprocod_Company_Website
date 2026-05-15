"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed", bottom: 88, left: 24, zIndex: 99,
        width: 40, height: 40, borderRadius: "50%",
        background: "white", border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: "#374151", transition: "box-shadow 0.2s",
      }}
    >
      <ArrowUp size={16} />
    </button>
  );
}
