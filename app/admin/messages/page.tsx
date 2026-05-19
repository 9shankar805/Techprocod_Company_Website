"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, off, remove } from "firebase/database";

type Message = {
  id: string;
  text: string;
  sender: string;
  role: string;
  timestamp: number;
};

const roleColor: Record<string, string> = {
  superadmin: "#7c3aed",
  editor: "#059669",
  support: "#2563eb",
};

export default function MessagesPage() {
  const { role, name } = useAdminSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let msgRef: any = null;
    let handler: any = null;

    if (rtdb) {
      msgRef = ref(rtdb, "teamMessages");
      handler = onValue(msgRef, snap => {
        if (!snap.exists()) { setMessages([]); return; }
        const msgs: Message[] = [];
        snap.forEach(child => {
          msgs.push({ id: child.key!, ...child.val() });
        });
        setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
      });
    }

    return () => {
      if (msgRef && handler) off(msgRef, "value", handler);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    setSending(false);
  };

  const deleteMsg = async (id: string) => {
    if (!rtdb) return;
    await remove(ref(rtdb, `teamMessages/${id}`));
  };

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Team Messages</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Internal team chat — real-time</p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "auto" }}>No messages yet. Say hello! 👋</p>
          )}
          {messages.map(msg => {
            const isMe = msg.sender === name;
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: (roleColor[msg.role] ?? "#6b7280") + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: roleColor[msg.role] ?? "#6b7280", flexShrink: 0 }}>
                  {msg.sender.charAt(0).toUpperCase()}
                </div>
                <div style={{ maxWidth: "70%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: roleColor[msg.role] ?? "#374151" }}>{msg.sender}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                    {(isMe || role === "superadmin") && (
                      <button onClick={() => deleteMsg(msg.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 0 }}><Trash2 size={11} /></button>
                    )}
                  </div>
                  <div style={{ background: isMe ? "#2563eb" : "#f3f4f6", color: isMe ? "white" : "#111827", padding: "10px 14px", borderRadius: isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px", fontSize: 14, lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            style={{ flex: 1 }}
          />
          <button onClick={send} disabled={sending || !text.trim()} className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
