"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  text: "Hi! 👋 I'm the Tech Procod assistant. Ask me about our services, pricing, or how to get started!",
  sender: "bot",
};

// One session ID per browser tab
const SESSION_ID = typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now().toString();

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [suggestions] = useState([
    "Tell me about Tech Procod",
    "What services do you offer?",
    "Where is your office?",
    "How can I contact you?",
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveToRtdb = async (text: string, sender: "user" | "bot") => {
    try {
      const msgRef = ref(rtdb, `chatSessions/${SESSION_ID}/messages`);
      await push(msgRef, { text, sender, timestamp: serverTimestamp() });
      // Keep session metadata updated
      await set(ref(rtdb, `chatSessions/${SESSION_ID}/meta`), {
        lastMessage: text,
        lastSender: sender,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Non-critical — don't block UI
    }
  };

  const send = async (e: React.FormEvent | null, customText?: string) => {
    if (e) e.preventDefault();
    const text = (customText || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Build history for Gemini (exclude the initial bot greeting)
    const history = updatedMessages
      .slice(1) // skip initial greeting
      .slice(0, -1) // exclude the message we just sent (sent separately)
      .map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, something went wrong.";
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
      saveToRtdb(text, "user");
      saveToRtdb(reply, "bot");
    } catch {
      const errMsg = "Sorry, I couldn't connect. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: errMsg, sender: "bot" },
      ]);
      saveToRtdb(errMsg, "bot");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    send(null, text);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 99,
            width: 52, height: 52, borderRadius: "50%",
            background: "#111827", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)", color: "white",
          }}
        >
          <Bot size={22} />
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 200,
            width: 360, maxWidth: "calc(100vw - 32px)",
            height: 520, maxHeight: "calc(100vh - 48px)",
            background: "white", borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid #e5e7eb",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ background: "#111827", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={16} color="white" />
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 600, fontSize: 14, lineHeight: 1 }}>Tech Procod Assistant</p>
                <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "#f9fafb" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "80%", padding: "10px 14px",
                    borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.sender === "user" ? "#2563eb" : "white",
                    color: msg.sender === "user" ? "white" : "#111827",
                    fontSize: 14, lineHeight: 1.5,
                    border: msg.sender === "bot" ? "1px solid #e5e7eb" : "none",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", display: "inline-block", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    fontSize: 12,
                    background: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #dbeafe",
                    borderRadius: 100,
                    padding: "6px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: 500,
                  }}
                  onMouseOver={(e) => { 
                    e.currentTarget.style.background = "#2563eb"; 
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => { 
                    e.currentTarget.style.background = "#eff6ff"; 
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={send} style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", background: "white", display: "flex", gap: 8 }}>
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..." disabled={loading}
              style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", background: loading ? "#f9fafb" : "white" }}
            />
            <button
              type="submit" disabled={loading || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 8, background: loading || !input.trim() ? "#e5e7eb" : "#2563eb", border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white" }}
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
