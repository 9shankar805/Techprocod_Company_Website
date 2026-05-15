"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Phone, Mail, Bot, Send } from "lucide-react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function FloatingContact() {
  const [contactOpen, setContactOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! 👋 Welcome to Tech Procod. Ask me about our services, pricing, or how to get started!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

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
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: data.reply || "Sorry, something went wrong.", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't connect. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Chat window ── */}
      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 200,
          width: 340, maxWidth: "calc(100vw - 32px)",
          height: 480, maxHeight: "calc(100vh - 120px)",
          background: "white", borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ background: "#111827", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={15} color="white" />
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 600, fontSize: 13, lineHeight: 1 }}>Tech Procod Assistant</p>
                <p style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>● Online</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, display: "flex" }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f9fafb" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "9px 13px", fontSize: 13, lineHeight: 1.55,
                  borderRadius: msg.sender === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                  background: msg.sender === "user" ? "#2563eb" : "white",
                  color: msg.sender === "user" ? "white" : "#111827",
                  border: msg.sender === "bot" ? "1px solid #e5e7eb" : "none",
                  whiteSpace: "pre-line",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "14px 14px 14px 3px", padding: "10px 14px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", display: "inline-block", animation: `chatBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} style={{ padding: "10px 12px", borderTop: "1px solid #e5e7eb", background: "white", display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
              style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 11px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 8, border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                background: loading || !input.trim() ? "#e5e7eb" : "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white",
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* ── Contact popup ── */}
      {contactOpen && (
        <div style={{
          position: "fixed", bottom: 88, right: 88, zIndex: 200,
          background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
          padding: 8, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", gap: 4, minWidth: 170,
        }}>
          <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#111827", textDecoration: "none" }}>
            <span style={{ color: "#22c55e" }}><WhatsAppIcon /></span>WhatsApp
          </a>
          <a href="tel:+9779800000000"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#111827", textDecoration: "none" }}>
            <Phone size={15} color="#2563eb" />Call Us
          </a>
          <a href="mailto:info@techprocod.com"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#111827", textDecoration: "none" }}>
            <Mail size={15} color="#8b5cf6" />Email Us
          </a>
        </div>
      )}

      {/* ── Two floating buttons side by side ── */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 150, display: "flex", gap: 12, alignItems: "center" }}>
        {/* Chat button */}
        <button
          onClick={() => { setChatOpen(!chatOpen); setContactOpen(false); }}
          aria-label="Open chat assistant"
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: chatOpen ? "#111827" : "#111827",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)", color: "white",
          }}
        >
          {chatOpen ? <X size={20} /> : <Bot size={20} />}
        </button>

        {/* Contact button */}
        <button
          onClick={() => { setContactOpen(!contactOpen); setChatOpen(false); }}
          aria-label="Contact us"
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#2563eb",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)", color: "white",
          }}
        >
          {contactOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
