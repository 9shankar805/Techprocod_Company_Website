"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, MapPin, Clock } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Job = {
  id: number;
  title: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  location: string;
  experience: string;
  skills: string;
  desc: string;
  status: "Open" | "Closed";
};

const INITIAL: Job[] = [
  { id: 1, title: "Full Stack Developer", type: "Full-time", location: "Siraha / Remote", experience: "2+ years", skills: "React, Laravel, MySQL, REST APIs", desc: "Build and maintain web applications for our clients.", status: "Open" },
  { id: 2, title: "React Native Developer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years", skills: "React Native, JavaScript, Firebase", desc: "Develop cross-platform mobile apps for Android and iOS.", status: "Open" },
  { id: 3, title: "UI/UX Designer", type: "Full-time", location: "Siraha / Remote", experience: "1+ years", skills: "Figma, Prototyping, User Research", desc: "Design beautiful, user-centered interfaces.", status: "Open" },
  { id: 4, title: "SEO & Digital Marketing Specialist", type: "Full-time", location: "Siraha", experience: "1+ years", skills: "SEO, Google Analytics, Social Media", desc: "Drive organic growth and digital visibility.", status: "Open" },
  { id: 5, title: "Web Development Intern", type: "Internship", location: "Siraha", experience: "Fresher", skills: "HTML/CSS, JavaScript, Basic React", desc: "3-month paid internship for web development students.", status: "Open" },
  { id: 6, title: "Graphic Design Intern", type: "Internship", location: "Siraha / Remote", experience: "Fresher", skills: "Figma, Adobe XD, Canva", desc: "3-month internship for design students.", status: "Closed" },
];

const EMPTY: Omit<Job, "id"> = { title: "", type: "Full-time", location: "Siraha / Remote", experience: "1+ years", skills: "", desc: "", status: "Open" };
const TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const;
const typeColor: Record<string, { bg: string; text: string }> = {
  "Full-time": { bg: "#eff6ff", text: "#2563eb" },
  "Part-time": { bg: "#f0fdf4", text: "#059669" },
  Internship: { bg: "#fffbeb", text: "#d97706" },
  Contract: { bg: "#faf5ff", text: "#7c3aed" },
};

export default function AdminJobs() {
  const { role, name } = useAdminSession();
  const [jobs, setJobs] = useState<Job[]>(INITIAL);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<Omit<Job, "id">>(EMPTY);
  const [filter, setFilter] = useState("All");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (j: Job) => { setEditing(j); setForm({ title: j.title, type: j.type, location: j.location, experience: j.experience, skills: j.skills, desc: j.desc, status: j.status }); setModal(true); };

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setJobs((prev) => prev.map((j) => j.id === editing.id ? { ...j, ...form } : j));
    } else {
      setJobs((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setJobs((prev) => prev.filter((j) => j.id !== id));
  const toggle = (id: number) => setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: j.status === "Open" ? "Closed" : "Open" } : j));

  const filtered = filter === "All" ? jobs : filter === "Open" || filter === "Closed" ? jobs.filter((j) => j.status === filter) : jobs.filter((j) => j.type === filter);

  const openCount = jobs.filter((j) => j.status === "Open").length;

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Job Listings</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{openCount} open positions · {jobs.length} total</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Post Job
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["All", "Open", "Closed", "Full-time", "Internship"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filter === s ? "#111827" : "white", color: filter === s ? "white" : "#374151", borderColor: filter === s ? "#111827" : "#e5e7eb" }}>{s}</button>
          ))}
        </div>

        {/* Job cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((j) => (
            <div key={j.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{j.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: typeColor[j.type].bg, color: typeColor[j.type].text }}>{j.type}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: j.status === "Open" ? "#f0fdf4" : "#f9fafb", color: j.status === "Open" ? "#059669" : "#9ca3af" }}>{j.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{j.desc}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{j.location}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} />{j.experience}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {j.skills.split(",").map((s) => (
                      <span key={s} style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 100 }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(j)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => toggle(j.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: j.status === "Open" ? "#d97706" : "#059669" }}>
                    {j.status === "Open" ? "Close" : "Reopen"}
                  </button>
                  <button onClick={() => remove(j.id)} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12 }}>No job listings found</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Job" : "Post New Job"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Job Title *</label>
                <input type="text" placeholder="e.g. Full Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Job["type"] })}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Experience</label>
                  <input type="text" placeholder="e.g. 2+ years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Location</label>
                <input type="text" placeholder="e.g. Siraha / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Required Skills (comma separated)</label>
                <input type="text" placeholder="React, Laravel, MySQL" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Job Description</label>
                <textarea rows={4} placeholder="Describe the role and responsibilities..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Open" | "Closed" })}>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
