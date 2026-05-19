"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Pin, Bell } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

function sanitize(str: string) {
  return str.replace(/[<>"'&]/g, c => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] ?? c));
}

type Announcement = {
  id: string;
  title: string;
  body: string;
  type: "General" | "Urgent" | "Holiday" | "Policy" | "Achievement";
  audience: "All" | "Employees" | "Management";
  pinned: boolean;
  createdAt: string;
  author: string;
};

const EMPTY: Omit<Announcement, "id" | "createdAt"> = {
  title: "", body: "", type: "General", audience: "All", pinned: false, author: "",
};

const typeStyle: Record<string, { bg: string; color: string }> = {
  General:     { bg: "#eff6ff", color: "#2563eb" },
  Urgent:      { bg: "#fef2f2", color: "#ef4444" },
  Holiday:     { bg: "#f0fdf4", color: "#059669" },
  Policy:      { bg: "#faf5ff", color: "#7c3aed" },
  Achievement: { bg: "#fffbeb", color: "#d97706" },
};

export default function AnnouncementsPage() {
  const { role, name } = useAdminSession();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Announcement, "id" | "createdAt">>(EMPTY);

  useEffect(() => {
    fetch("/api/admin/announcements").then(r => r.json()).then(d => { if (Array.isArray(d)) setItems(d); setLoading(false); });
  }, []);

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    const payload = { ...form, author: form.author || name };
    const res = await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const { id } = await res.json();
    setItems(prev => [{ id, ...payload, createdAt: new Date().toISOString() }, ...prev]);
    setSaving(false); setModal(false); setForm(EMPTY);
  };

  const togglePin = async (item: Announcement) => {
    await fetch("/api/admin/announcements", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, pinned: !item.pinned }) });
    setItems(prev => prev.map(a => a.id === item.id ? { ...a, pinned: !a.pinned } : a));
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/announcements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(prev => prev.filter(a => a.id !== id));
  };

  const pinned = items.filter(a => a.pinned);
  const unpinned = items.filter(a => !a.pinned);

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  const Card = ({ a }: { a: Announcement }) => (
    <div style={{ background: "white", border: `1px solid ${a.pinned ? "#fde68a" : "#e5e7eb"}`, borderRadius: 12, padding: 20, position: "relative" }}>
      {a.pinned && <div style={{ position: "absolute", top: 12, right: 12, color: "#d97706" }}><Pin size={14} /></div>}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: typeStyle[a.type].bg, color: typeStyle[a.type].color }}>{a.type}</span>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "#f3f4f6", color: "#6b7280" }}>{a.audience}</span>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{sanitize(a.title)}</h3>
      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>{sanitize(a.body)}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          By {sanitize(a.author)} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => togglePin(a)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${a.pinned ? "#fde68a" : "#e5e7eb"}`, background: a.pinned ? "#fffbeb" : "white", cursor: "pointer", fontSize: 12, color: a.pinned ? "#d97706" : "#6b7280" }}>
            {a.pinned ? "Unpin" : "Pin"}
          </button>
          <button onClick={() => remove(a.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Announcements</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Company-wide notices and updates</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setModal(true); }} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> New Announcement</button>
        </div>

        {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>}

        {!loading && pinned.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Pin size={12} /> Pinned</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pinned.map(a => <Card key={a.id} a={a} />)}
            </div>
          </div>
        )}

        {!loading && (
          <div>
            {pinned.length > 0 && <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>All Announcements</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {unpinned.map(a => <Card key={a.id} a={a} />)}
              {items.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12 }}>
                  <Bell size={24} style={{ margin: "0 auto 12px", display: "block", color: "#d1d5db" }} />
                  No announcements yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>New Announcement</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <F label="Title *"><input placeholder="e.g. Office closed on Dashain" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Announcement["type"] })}>
                  {["General","Urgent","Holiday","Policy","Achievement"].map(t => <option key={t}>{t}</option>)}
                </select></F>
                <F label="Audience"><select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value as Announcement["audience"] })}>
                  {["All","Employees","Management"].map(a => <option key={a}>{a}</option>)}
                </select></F>
              </div>
              <F label="Message *"><textarea rows={5} placeholder="Write your announcement..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ resize: "vertical" }} /></F>
              <F label="Author"><input placeholder={name} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></F>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
                Pin this announcement to the top
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}><Save size={14} /> {saving ? "Saving..." : "Post"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
