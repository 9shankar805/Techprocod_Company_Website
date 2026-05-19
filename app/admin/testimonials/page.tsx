"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Star } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Testimonial = { id: string; name: string; role: string; content: string; rating: number; order: number; active: boolean };
const EMPTY: Omit<Testimonial, "id"> = { name: "", role: "", content: "", rating: 5, order: 0, active: true };

export default function TestimonialsAdminPage() {
  const { role, name } = useAdminSession();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "id">>(EMPTY);

  useEffect(() => {
    fetch("/api/admin/testimonials").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, order: items.length }); setModal(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ ...t }); setModal(true); };

  const save = async () => {
    if (!form.name.trim() || !form.content.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setItems(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
    } else {
      const res = await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setItems(prev => [...prev, { id, ...form }]);
    }
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(prev => prev.filter(t => t.id !== id));
  };

  const toggleActive = async (t: Testimonial) => {
    await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: t.id, active: !t.active }) });
    setItems(prev => prev.map(x => x.id === t.id ? { ...x, active: !x.active } : x));
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Testimonials</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage client testimonials shown on the homepage</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> Add Testimonial</button>
        </div>

        {loading && <p style={{ color: "#9ca3af" }}>Loading...</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(t => (
            <div key={t.id} style={{ background: "white", border: `1px solid ${t.active ? "#e5e7eb" : "#f3f4f6"}`, borderRadius: 12, padding: 20, opacity: t.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{t.name}</p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>— {t.role}</p>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>&ldquo;{t.content}&rdquo;</p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => toggleActive(t)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: t.active ? "#f0fdf4" : "white", cursor: "pointer", fontSize: 11, fontWeight: 600, color: t.active ? "#059669" : "#9ca3af" }}>
                    {t.active ? "Active" : "Hidden"}
                  </button>
                  <button onClick={() => openEdit(t)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}>Edit</button>
                  <button onClick={() => remove(t.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12 }}>
              No testimonials yet. Add your first one.
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Client Name *"><input placeholder="e.g. Ramesh Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
                <F label="Role / Company *"><input placeholder="e.g. CEO, Siraha Bazaar" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></F>
              </div>
              <F label="Testimonial *"><textarea rows={4} placeholder="What did the client say..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ resize: "vertical" }} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Rating (1-5)">
                  <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </F>
                <F label="Display Order"><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></F>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                Show on homepage
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
