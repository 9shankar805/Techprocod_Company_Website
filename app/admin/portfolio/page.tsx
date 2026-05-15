"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Project = {
  id: number;
  name: string;
  category: string;
  desc: string;
  tech: string;
  link: string;
  status: "Published" | "Draft";
};

const INITIAL: Project[] = [
  { id: 1, name: "StyleAura", category: "E-commerce", desc: "Fashion e-commerce with AI style recommendations.", tech: "Next.js, Laravel, MySQL, AI/ML", link: "#", status: "Published" },
  { id: 2, name: "RideSewa", category: "Mobile App", desc: "Nepal's ride-hailing app with real-time GPS tracking.", tech: "React Native, Node.js, Socket.io", link: "#", status: "Published" },
  { id: 3, name: "HotelSewa", category: "Web App", desc: "Hotel management and booking platform.", tech: "React, Laravel, MySQL, Stripe", link: "#", status: "Published" },
  { id: 4, name: "Siraha Bazaar", category: "E-commerce", desc: "Hyperlocal marketplace for Siraha district.", tech: "Next.js, Laravel, eSewa, Khalti", link: "#", status: "Published" },
  { id: 5, name: "SchoolPro", category: "Web App", desc: "School management system.", tech: "React, Laravel, MySQL", link: "#", status: "Published" },
  { id: 6, name: "FoodRun", category: "Mobile App", desc: "Food delivery platform.", tech: "React Native, Laravel, Firebase", link: "#", status: "Draft" },
];

const EMPTY: Omit<Project, "id"> = { name: "", category: "Web App", desc: "", tech: "", link: "", status: "Draft" };
const CATEGORIES = ["Web App", "Mobile App", "E-commerce", "Platform", "SaaS"];

export default function AdminPortfolio() {
  const { role, name } = useAdminSession();
  const [items, setItems] = useState<Project[]>(INITIAL);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ name: p.name, category: p.category, desc: p.desc, tech: p.tech, link: p.link, status: p.status }); setModal(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const toggle = (id: number) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: i.status === "Published" ? "Draft" : "Published" } : i));

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Portfolio</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage your project showcase</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Add Project
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {items.map((p) => (
            <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{p.category}</p>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{p.name}</h3>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100, flexShrink: 0, background: p.status === "Published" ? "#f0fdf4" : "#f9fafb", color: p.status === "Published" ? "#059669" : "#9ca3af" }}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>{p.tech}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: "#374151" }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => toggle(p.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: p.status === "Published" ? "#d97706" : "#059669" }}>
                    {p.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => remove(p.id)} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Project Name *", key: "name", type: "text", placeholder: "e.g. StyleAura" },
                { label: "Live Link", key: "link", type: "url", placeholder: "https://..." },
                { label: "Tech Stack", key: "tech", type: "text", placeholder: "React, Laravel, MySQL" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Description</label>
                <textarea rows={3} placeholder="Brief project description..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} style={{ resize: "vertical" }} />
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
                  <Save size={14} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
