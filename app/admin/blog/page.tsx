"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  status: "Published" | "Draft";
};

const EMPTY: Omit<Post, "id"> = {
  title: "", slug: "", category: "Tech", excerpt: "", content: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  readTime: "5 min", status: "Draft",
};
const CATEGORIES = ["Tech", "Tutorial", "Case Study", "AI", "Design", "Company", "News"];
const catColor: Record<string, string> = { Tech: "#2563eb", Tutorial: "#059669", "Case Study": "#7c3aed", AI: "#d97706", Design: "#db2777", Company: "#0891b2", News: "#374151" };

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlog() {
  const { role, name } = useAdminSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Omit<Post, "id">>(EMPTY);
  const [filter, setFilter] = useState("All");

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetch("/api/admin/blog").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setPosts(data);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setPreviewMode(false); setModal(true); };
  const openEdit = (p: Post) => { setEditing(p); setForm({ title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt, content: p.content, date: p.date, readTime: p.readTime, status: p.status }); setPreviewMode(false); setModal(true); };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const slug = form.slug || toSlug(form.title);
    const payload = { ...form, slug };
    if (editing) {
      await fetch("/api/admin/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...payload }) });
      setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p));
    } else {
      const res = await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { id } = await res.json();
      setPosts((prev) => [{ id, ...payload }, ...prev]);
    }
    setSaving(false);
    setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/blog", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggle = async (p: Post) => {
    const status = p.status === "Published" ? "Draft" : "Published";
    await fetch("/api/admin/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, status }) });
    setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, status } : x));
  };

  const filtered = filter === "All" ? posts : posts.filter((p) => p.status === filter);

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Blog Posts</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{posts.length} posts · {posts.filter((p) => p.status === "Published").length} published</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> New Post
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", "Published", "Draft"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filter === s ? "#111827" : "white", color: filter === s ? "white" : "#374151", borderColor: filter === s ? "#111827" : "#e5e7eb" }}>{s}</button>
          ))}
        </div>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Title", "Category", "Date", "Read Time", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Loading...</td></tr>}
              {!loading && filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", maxWidth: 280 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>/{p.slug}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: catColor[p.category] || "#374151", background: (catColor[p.category] || "#374151") + "15", padding: "3px 8px", borderRadius: 100 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{p.date}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{p.readTime}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 100, background: p.status === "Published" ? "#f0fdf4" : "#f9fafb", color: p.status === "Published" ? "#059669" : "#9ca3af" }}>{p.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                      <button onClick={() => toggle(p)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: p.status === "Published" ? "#d97706" : "#059669", fontSize: 11, fontWeight: 500 }}>
                        {p.status === "Published" ? "Draft" : "Publish"}
                      </button>
                      <button onClick={() => remove(p.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No posts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Post" : "New Blog Post"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Title *</label>
                <input type="text" placeholder="Post title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: toSlug(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Slug</label>
                <input type="text" placeholder="auto-generated-from-title" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Read Time</label>
                  <input type="text" placeholder="5 min" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Excerpt</label>
                <textarea rows={2} placeholder="Short description..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Content (Markdown supported)</label>
                  <button type="button" onClick={() => setPreviewMode(p => !p)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Eye size={13} /> {previewMode ? "Edit" : "Preview"}
                  </button>
                </div>
                {previewMode ? (
                  <div style={{ minHeight: 200, border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#374151", lineHeight: 1.8, background: "#f9fafb", whiteSpace: "pre-wrap" }}>
                    {form.content || <span style={{ color: "#9ca3af" }}>Nothing to preview</span>}
                  </div>
                ) : (
                  <textarea rows={10} placeholder="Write your blog post content here... (Markdown supported)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
                )}
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Published" | "Draft" })}>
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Save Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
