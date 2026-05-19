"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { ROLE_LABELS, type Role } from "@/lib/adminAuth";

type User = { id: string; username: string; password: string; name: string; role: Role; createdAt?: string };

const EMPTY: Omit<User, "id" | "createdAt"> = { username: "", password: "", name: "", role: "support" };
const ROLES: Role[] = ["superadmin", "editor", "support"];
const ROLE_DESC: Record<Role, string> = {
  superadmin: "Full access — all modules, users, finance, HR, settings",
  editor: "Can manage portfolio, blog, tasks, and announcements",
  support: "Can manage inquiries, employees, leaves, and attendance",
};

export default function AdminUsers() {
  const { role, name } = useAdminSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id" | "createdAt">>(EMPTY);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setUsers(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowPw(false); setModal(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ username: u.username, password: u.password, name: u.name, role: u.role }); setShowPw(false); setModal(true); };

  const save = async () => {
    if (!form.username.trim() || !form.name.trim() || !form.password.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u));
    } else {
      const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setUsers(prev => [...prev, { id, ...form }]);
    }
    setSaving(false);
    setModal(false);
  };

  const del = async (u: User) => {
    if (!confirm(`Delete user "${u.name}"?`)) return;
    await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id }) });
    setUsers(prev => prev.filter(x => x.id !== u.id));
  };

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Users</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage admin accounts and roles — stored in Firestore</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Add User
          </button>
        </div>

        {/* Role legend */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 28 }}>
          {ROLES.map(r => {
            const info = ROLE_LABELS[r];
            return (
              <div key={r} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: info.color, background: info.bg, padding: "3px 10px", borderRadius: 100, display: "inline-block", marginBottom: 8 }}>{info.label}</span>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{ROLE_DESC[r]}</p>
              </div>
            );
          })}
        </div>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Name", "Username", "Role", "Created", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No users yet. Add your first admin user.</td></tr>
              )}
              {!loading && users.map(u => {
                const info = ROLE_LABELS[u.role];
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: info.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: info.color, flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{u.name}</p>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>{u.username}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: info.color, background: info.bg, padding: "3px 10px", borderRadius: 100 }}>{info.label}</span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#9ca3af" }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(u)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => del(u)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "e.g. Ram Sharma" },
                { label: "Username *", key: "username", type: "text", placeholder: "e.g. ram" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as Record<string, string>)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r].label}</option>)}
                </select>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{ROLE_DESC[form.role]}</p>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Save User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
