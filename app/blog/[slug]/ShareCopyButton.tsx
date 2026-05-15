"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ShareCopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 18px",
        background: copied ? "#f0fdf4" : "#f3f4f6",
        color: copied ? "#16a34a" : "#374151",
        border: `1px solid ${copied ? "#bbf7d0" : "#e5e7eb"}`,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
