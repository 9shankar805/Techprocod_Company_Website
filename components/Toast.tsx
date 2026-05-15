"use client";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import type { ToastItem } from "@/hooks/useToast";

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", icon: "#16a34a", text: "#15803d" },
  error: { bg: "#fef2f2", border: "#fecaca", icon: "#dc2626", text: "#b91c1c" },
  info: { bg: "#eff6ff", border: "#bfdbfe", icon: "#2563eb", text: "#1d4ed8" },
};

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 360,
        width: "calc(100vw - 40px)",
      }}
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        const c = colors[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Icon size={16} color={c.icon} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 14, color: c.text, flex: 1, lineHeight: 1.5 }}>{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: c.icon, flexShrink: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
