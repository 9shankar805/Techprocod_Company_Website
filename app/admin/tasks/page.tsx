"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Search } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Todo" | "In Progress" | "Review" | "Done";
  dueDate: string;
  estimatedHours: string;
  tags: string;
};

const EMPTY: Omit<Task, "id"> = {
  title: "", description: "", project: "", assignedTo: "",
  priority: "Medium", status: "Todo",
  dueDate: "", estimatedHours: "", tags: "",
};

const STATUSES = ["Todo", "In Progress", "Review", "Done"] as const;

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  "Todo":        { bg: "#f9fafb", color: "#6b7280", border: "#e5e7eb" },
  "In Progress": { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Review":      { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
  "Done":        { bg: "#f0fdf4", color: "#059669", border: "#bbf7d0" },
};

const priorityStyle: Record<string, { color: string; bg: string }> = {
  Low:      { color: "#6b7280", bg: "#f9fafb" },
  Medium:   { color: "#d97706", bg: "#fffbeb" },
  High:     { color: "#ea580c", bg: "#fff7ed" },
  Critical: { color: "#ef4444", bg: "#fef2f2" },
};

export default function TasksPage() {
  const { role, name } = useAdminSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id">>(EMPTY);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    fetch("/api/admin/tasks").then(r => r.json()).then(d => { if (Array.isArray(d)) setTasks(d); setLoading(false); });
  }, []);

  const openAdd = (status?: Task["status"]) => { setEditing(null); setForm({ ...EMPTY, status: status || "Todo" }); setModal(true); };
  const openEdit = (t: Task) => { setEditing(t); setForm({ ...t }); setModal(true); };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
    } else {
      const res = await fetch("/api/admin/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setTasks(prev => [{ id, ...form }, ...prev]);
    }
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveStatus = async (id: string, status: Task["status"]) => {
    await fetch("/api/admin/tasks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    return (t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q)) &&
      (filterPriority === "All" || t.priority === filterPriority);
  });

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  const TaskCard = ({ task }: { task: Task }) => (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: priorityStyle[task.priority].bg, color: priorityStyle[task.priority].color }}>{task.priority}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => openEdit(task)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}><Pencil size={12} /></button>
          <button onClick={() => remove(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 2 }}><Trash2 size={12} /></button>
        </div>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4, lineHeight: 1.4 }}>{task.title}</p>
      {task.project && <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>📁 {task.project}</p>}
      {task.description && <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, marginBottom: 8 }}>{task.description}</p>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {task.assignedTo && <span style={{ fontSize: 11, color: "#6b7280" }}>👤 {task.assignedTo}</span>}
        {task.dueDate && <span style={{ fontSize: 11, color: new Date(task.dueDate) < new Date() && task.status !== "Done" ? "#ef4444" : "#9ca3af" }}>📅 {task.dueDate}</span>}
      </div>
      {/* Move buttons */}
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {STATUSES.filter(s => s !== task.status).map(s => (
          <button key={s} onClick={() => moveStatus(task.id, s)} style={{ flex: 1, padding: "3px 0", borderRadius: 5, border: `1px solid ${statusStyle[s].border}`, background: statusStyle[s].bg, cursor: "pointer", fontSize: 10, color: statusStyle[s].color, fontWeight: 500 }}>→ {s}</button>
        ))}
      </div>
    </div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1300 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Tasks</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{tasks.length} tasks · {tasks.filter(t => t.status === "In Progress").length} in progress · {tasks.filter(t => t.status === "Done").length} done</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              {(["kanban", "list"] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: "7px 14px", fontSize: 13, border: "none", cursor: "pointer", background: view === v ? "#111827" : "white", color: view === v ? "white" : "#374151", textTransform: "capitalize" }}>{v}</button>
              ))}
            </div>
            <button onClick={() => openAdd()} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> Add Task</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search tasks, project, assignee..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ minWidth: 130 }}>
            <option value="All">All Priorities</option>
            {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>}

        {/* Kanban View */}
        {!loading && view === "kanban" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
            {STATUSES.map(status => {
              const col = filtered.filter(t => t.status === status);
              return (
                <div key={status}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: statusStyle[status].color }}>{status}</span>
                      <span style={{ fontSize: 11, background: statusStyle[status].bg, color: statusStyle[status].color, padding: "1px 7px", borderRadius: 100, fontWeight: 600 }}>{col.length}</span>
                    </div>
                    <button onClick={() => openAdd(status)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><Plus size={14} /></button>
                  </div>
                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: 10, minHeight: 100 }}>
                    {col.map(t => <TaskCard key={t.id} task={t} />)}
                    {col.length === 0 && <p style={{ fontSize: 12, color: "#d1d5db", textAlign: "center", padding: "20px 0" }}>No tasks</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {!loading && view === "list" && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Task", "Project", "Assigned To", "Priority", "Status", "Due Date", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{t.title}</p>
                      {t.description && <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{t.description.slice(0, 60)}{t.description.length > 60 ? "..." : ""}</p>}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{t.project || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{t.assignedTo || "—"}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: priorityStyle[t.priority].bg, color: priorityStyle[t.priority].color }}>{t.priority}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: statusStyle[t.status].bg, color: statusStyle[t.status].color }}>{t.status}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done" ? "#ef4444" : "#6b7280" }}>{t.dueDate || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(t)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                        <button onClick={() => remove(t.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No tasks found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Task" : "New Task"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <F label="Task Title *"><input placeholder="e.g. Design homepage mockup" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></F>
              <F label="Description"><textarea rows={2} placeholder="Task details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} /></F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Project"><input placeholder="Project name" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} /></F>
                <F label="Assigned To"><input placeholder="Employee name" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} /></F>
                <F label="Priority"><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Task["priority"] })}>
                  {["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}
                </select></F>
                <F label="Status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Task["status"] })}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select></F>
                <F label="Due Date"><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></F>
                <F label="Est. Hours"><input type="number" placeholder="e.g. 8" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} /></F>
              </div>
              <F label="Tags (comma separated)"><input placeholder="frontend, design, urgent" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></F>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}><Save size={14} /> {saving ? "Saving..." : editing ? "Update" : "Add Task"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
