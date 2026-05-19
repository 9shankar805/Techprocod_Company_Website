"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Search, Users, Calendar, ExternalLink } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Project = {
  id: string;
  name: string;
  client: string;
  description: string;
  type: string;
  status: "Planning" | "Active" | "On Hold" | "Review" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";
  startDate: string;
  deadline: string;
  budget: string;
  techStack: string;
  assignedTo: string;
  projectManager: string;
  progress: number;
  liveUrl: string;
  repoUrl: string;
  notes: string;
};

const EMPTY: Omit<Project, "id"> = {
  name: "", client: "", description: "", type: "Web App",
  status: "Planning", priority: "Medium",
  startDate: new Date().toISOString().split("T")[0], deadline: "",
  budget: "", techStack: "", assignedTo: "", projectManager: "",
  progress: 0, liveUrl: "", repoUrl: "", notes: "",
};

const TYPES = ["Web App", "Mobile App", "E-commerce", "SaaS", "API", "Design", "Marketing", "Other"];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Planning:   { bg: "#eff6ff", color: "#2563eb" },
  Active:     { bg: "#f0fdf4", color: "#059669" },
  "On Hold":  { bg: "#fffbeb", color: "#d97706" },
  Review:     { bg: "#faf5ff", color: "#7c3aed" },
  Completed:  { bg: "#f0fdf4", color: "#059669" },
  Cancelled:  { bg: "#fef2f2", color: "#ef4444" },
};

const priorityStyle: Record<string, { bg: string; color: string }> = {
  Low:      { bg: "#f9fafb", color: "#6b7280" },
  Medium:   { bg: "#fffbeb", color: "#d97706" },
  High:     { bg: "#fff7ed", color: "#ea580c" },
  Critical: { bg: "#fef2f2", color: "#ef4444" },
};

export default function ProjectsPage() {
  const { role, name } = useAdminSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [tab, setTab] = useState<"info" | "team" | "links">("info");

  useEffect(() => {
    fetch("/api/admin/projects").then(r => r.json()).then(d => { if (Array.isArray(d)) setProjects(d); setLoading(false); });
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setTab("info"); setModal(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ ...p }); setTab("info"); setModal(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setProjects(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setProjects(prev => [{ id, ...form }, ...prev]);
    }
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/admin/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateProgress = async (id: string, progress: number) => {
    await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, progress }) });
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
  };

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.assignedTo.toLowerCase().includes(q)) &&
      (filterStatus === "All" || p.status === filterStatus);
  });

  const stats = [
    { label: "Total", value: projects.length, color: "#2563eb" },
    { label: "Active", value: projects.filter(p => p.status === "Active").length, color: "#059669" },
    { label: "On Hold", value: projects.filter(p => p.status === "On Hold").length, color: "#d97706" },
    { label: "Completed", value: projects.filter(p => p.status === "Completed").length, color: "#7c3aed" },
  ];

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Projects</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage client projects and assignments</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> New Project</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search project, client, assignee..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Planning", "Active", "On Hold", "Review", "Completed"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filterStatus === s ? "#111827" : "white", color: filterStatus === s ? "white" : "#374151", borderColor: filterStatus === s ? "#111827" : "#e5e7eb" }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 16 }}>
          {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>}
          {!loading && filtered.map(p => (
            <div key={p.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: statusStyle[p.status].bg, color: statusStyle[p.status].color }}>{p.status}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: priorityStyle[p.priority].bg, color: priorityStyle[p.priority].color }}>{p.priority}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{p.name}</h3>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{p.client} · {p.type}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 10 }}>{p.description}</p>
                {/* Progress bar */}
                <div style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress === 100 ? "#059669" : "#2563eb", borderRadius: 100, transition: "width 0.3s" }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {p.assignedTo && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                    <Users size={12} /> <span>{p.assignedTo}</span>
                  </div>
                )}
                {p.deadline && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: new Date(p.deadline) < new Date() && p.status !== "Completed" ? "#ef4444" : "#6b7280" }}>
                    <Calendar size={12} /> Deadline: {p.deadline}
                  </div>
                )}
                {p.budget && (
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Budget: NPR {Number(p.budget).toLocaleString()}</div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button onClick={() => setViewModal(p)} style={{ flex: 1, padding: "6px 0", borderRadius: 7, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}>View</button>
                  <button onClick={() => openEdit(p)} style={{ flex: 1, padding: "6px 0", borderRadius: 7, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}><Pencil size={12} style={{ display: "inline", marginRight: 4 }} />Edit</button>
                  <button onClick={() => remove(p.id)} style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12 }}>No projects found</div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{viewModal.name}</h2>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{viewModal.client} · {viewModal.type}</p>
              </div>
              <button onClick={() => setViewModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: statusStyle[viewModal.status].bg, color: statusStyle[viewModal.status].color }}>{viewModal.status}</span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: priorityStyle[viewModal.priority].bg, color: priorityStyle[viewModal.priority].color }}>{viewModal.priority} Priority</span>
            </div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>{viewModal.description}</p>
            {/* Progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>{viewModal.progress}%</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 100 }}>
                <div style={{ height: "100%", width: `${viewModal.progress}%`, background: "#2563eb", borderRadius: 100 }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {[0, 25, 50, 75, 100].map(v => (
                  <button key={v} onClick={() => { updateProgress(viewModal.id, v); setViewModal({ ...viewModal, progress: v }); }} style={{ flex: 1, padding: "4px 0", borderRadius: 6, border: "1px solid", fontSize: 11, cursor: "pointer", background: viewModal.progress === v ? "#2563eb" : "white", color: viewModal.progress === v ? "white" : "#374151", borderColor: viewModal.progress === v ? "#2563eb" : "#e5e7eb" }}>{v}%</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Project Manager", viewModal.projectManager],
                ["Assigned To", viewModal.assignedTo],
                ["Start Date", viewModal.startDate],
                ["Deadline", viewModal.deadline],
                ["Budget", viewModal.budget ? `NPR ${Number(viewModal.budget).toLocaleString()}` : "—"],
                ["Tech Stack", viewModal.techStack],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{k}</p>
                  <p style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{v || "—"}</p>
                </div>
              ))}
            </div>
            {(viewModal.liveUrl || viewModal.repoUrl) && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {viewModal.liveUrl && <a href={viewModal.liveUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><ExternalLink size={13} /> Live URL</a>}
                {viewModal.repoUrl && <a href={viewModal.repoUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#374151", textDecoration: "none" }}><ExternalLink size={13} /> Repository</a>}
              </div>
            )}
            {viewModal.notes && <div style={{ background: "#f9fafb", borderRadius: 8, padding: 12, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{viewModal.notes}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => { setViewModal(null); openEdit(viewModal); }} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}><Pencil size={13} /> Edit</button>
              <button onClick={() => setViewModal(null)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", gap: 0, padding: "12px 24px 0", borderBottom: "1px solid #e5e7eb" }}>
              {(["info", "team", "links"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, border: "none", background: "none", cursor: "pointer", color: tab === t ? "#2563eb" : "#6b7280", borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent", textTransform: "capitalize" }}>{t === "links" ? "Links & Notes" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {tab === "info" && <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <F label="Project Name *"><input placeholder="e.g. StyleAura v2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
                  <F label="Client Name"><input placeholder="e.g. Ramesh Sharma" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></F>
                  <F label="Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></F>
                  <F label="Status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Project["status"] })}>
                    {["Planning","Active","On Hold","Review","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                  </select></F>
                  <F label="Priority"><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Project["priority"] })}>
                    {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                  </select></F>
                  <F label="Budget (NPR)"><input type="number" placeholder="e.g. 150000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} /></F>
                  <F label="Start Date"><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></F>
                  <F label="Deadline"><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></F>
                </div>
                <F label="Description"><textarea rows={3} placeholder="Project overview..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} /></F>
                <F label="Tech Stack"><input placeholder="Next.js, Laravel, MySQL, Firebase" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} /></F>
                <F label={`Progress: ${form.progress}%`}>
                  <input type="range" min={0} max={100} step={5} value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} style={{ width: "100%" }} />
                </F>
              </>}
              {tab === "team" && <>
                <F label="Project Manager"><input placeholder="e.g. Ram Sharma" value={form.projectManager} onChange={e => setForm({ ...form, projectManager: e.target.value })} /></F>
                <F label="Assigned Team Members"><textarea rows={3} placeholder="e.g. Ram Sharma, Sita Devi, Bikash Yadav" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} style={{ resize: "vertical" }} /></F>
              </>}
              {tab === "links" && <>
                <F label="Live URL"><input type="url" placeholder="https://..." value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} /></F>
                <F label="Repository URL"><input type="url" placeholder="https://github.com/..." value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} /></F>
                <F label="Notes"><textarea rows={4} placeholder="Internal notes, client requirements..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "vertical" }} /></F>
              </>}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}><Save size={14} /> {saving ? "Saving..." : editing ? "Update" : "Create Project"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
