"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Post = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  status: "Published" | "Draft";
};

const INITIAL: Post[] = [
  { id: 1, title: "How We Built a Ride-Sharing App for Nepal", slug: "building-ride-sharing-app-nepal", category: "Case Study", excerpt: "A deep dive into the technical challenges building RideSewa.", content: "", date: "Dec 15, 2024", readTime: "8 min", status: "Published" },
  { id: 2, title: "Next.js + Laravel: The Perfect Stack for Nepal", slug: "nextjs-vs-laravel-nepal", category: "Tech", excerpt: "Why we chose Next.js and Laravel for our projects.", content: "", date: "Dec 10, 2024", readTime: "6 min", status: "Published" },
  { id: 3, title: "AI Integration for Nepali Businesses in 2025", slug: "ai-integration-nepali-business", category: "AI", excerpt: "How SMEs in Nepal can leverage AI to grow.", content: "", date: "Dec 5, 2024", readTime: "5 min", status: "Published" },
  { id: 4, title: "Complete Guide to eSewa & Khalti Integration", slug: "esewa-khalti-integration-guide", category: "Tutorial", excerpt: "Step-by-step payment gateway integration guide.", content: "", date: "Nov 28, 2024", readTime: "10 min", status: "Published" },
  { id: 5, title: "Why Mobile-First Design Matters in Nepal", slug: "mobile-first-design-nepal", category: "Design", excerpt: "80%+ of Nepal's users are on mobile.", content: "", date: "Nov 20, 2024", readTime: "4 min", status: "Published" },
  { id: 6, title: "Tech Procod 2024: Year in Review", slug: "techprocod-2024-year-review", category: "Company", excerpt: "Our biggest milestones and lessons from 2024.", content: "", date: "Nov 15, 2024", readTime: "7 min", status: "Draft" },
];

const EMPTY: Omit<Post, "id"> = { title: "", slug: "", category: "Tech", excerpt: "", content: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), readTime: "5 min", status: "Draft" };
const CATEGORIES = ["Tech", "Tutorial", "Case Study", "AI", "Design", "Company", "News"];
const catColor: Record<string, string> = { Tech: "#2563eb", Tutorial: "#059669", "Case Study": "#7c3aed", AI: "#d97706", Design: "#db2777", Company: "#0891b2", News: "#374151" };

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlog() {
  const { role, name } = useAdminSession();
  const [posts, setPosts] = useState<Post[]>(INITIAL);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Omit<Post, "id">>(EMPTY);
  const [filter, setFilter] = useState("All");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: Post) => { setEditing(p); setForm({ title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt, content: p.content, date: p.date, readTime: p.readTime, status: p.status }); setModal(true); };

  const save = () => {
    if (!form.title.trim()) return;
    const slug = form.slug || toSlug(form.title);
    if (editing) {
      setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form, slug } : p));
    } else {
      setPosts((prev) => [...prev, { id: Date.now(), ...form, slug }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setPosts((prev) => prev.filter((p) => p.id !== id));
  const toggle = (id: number) => setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "Published" ? "Draft" : "Published" } : p));

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

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", "Published", "Draft"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filter === s ? "#111827" : "white", color: filter === s ? "white" : "#374151", borderColor: filter === s ? "#111827" : "#e5e7eb" }}>{s}</button>
          ))}
        </div>

        {/* Table */}
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
              {filtered.map((p) => (
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
                      <button onClick={() => toggle(p.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: p.status === "Published" ? "#d97706" : "#059669", fontSize: 11, fontWeight: 500 }}>
                        {p.status === "Published" ? "Draft" : "Publish"}
                      </button>
                      <button onClick={() => remove(p.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No posts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
                <textarea rows={2} placeholder="Short description shown in blog list..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Content</label>
                <textarea rows={8} placeholder="Write your blog post content here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
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
                <button onClick={save} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> Save Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
