"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { ROLE_LABELS, type Role } from "@/lib/adminAuth";

type User = { id: number; username: string; password: string; name: string; role: Role };

const INITIAL: User[] = [
  { id: 1, username: "admin",   password: "techprocod@2024", name: "Super Admin",    role: "superadmin" },
  { id: 2, username: "editor",  password: "editor@2024",     name: "Content Editor", role: "editor" },
  { id: 3, username: "support", password: "support@2024",    name: "Support Staff",  role: "support" },
];

const EMPTY: Omit<User, "id"> = { username: "", password: "", name: "", role: "support" };
const ROLES: Role[] = ["superadmin", "editor", "support"];

const ROLE_DESC: Record<Role, string> = {
  superadmin: "Full access — dashboard, inquiries, portfolio, blog, jobs, users",
  editor:     "Can manage portfolio and blog posts only",
  support:    "Can view and manage inquiries only",
};

export default function AdminUsers() {
  const { role, name } = useAdminSession();
  const [users, setUsers] = useState<User[]>(INITIAL);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>(EMPTY);
  const [showPw, setShowPw] = useState(false);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowPw(false); setModal(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ username: u.username, password: u.password, name: u.name, role: u.role }); setShowPw(false); setModal(true); };

  const save = () => {
    if (!form.username.trim() || !form.name.trim()) return;
    if (editing) {
      setUsers((p) => p.map((u) => u.id === editing.id ? { ...u, ...form } : u));
    } else {
      setUsers((p) => [...p, { id: Date.now(), ...form }]);
    }
    setModal(false);
  };

  const del = (id: number) => {
    if (id === 1) return; // protect superadmin
    setUsers((p) => p.filter((u) => u.id !== id));
  };

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Users</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage admin accounts and roles</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Add User
          </button>
        </div>

        {/* Role legend */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 28 }}>
          {ROLES.map((r) => {
            const info = ROLE_LABELS[r];
            return (
              <div key={r} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: info.color, background: info.bg, padding: "3px 10px", borderRadius: 100, display: "inline-block", marginBottom: 8 }}>
                  {info.label}
                </span>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{ROLE_DESC[r]}</p>
              </div>
            );
          })}
        </div>

        {/* Users table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Name", "Username", "Role", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const info = ROLE_LABELS[u.role];
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: info.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: info.color, flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{u.name}</p>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>{u.username}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: info.color, background: info.bg, padding: "3px 10px", borderRadius: 100 }}>
                        {info.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(u)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                          <Pencil size={13} /> Edit
                        </button>
                        {u.id !== 1 && (
                          <button onClick={() => del(u.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
          ⚠️ Password changes here are for demo only. In production, connect to a database and hash passwords.
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Full Name *</label>
                <input type="text" placeholder="e.g. John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Username *</label>
                <input type="text" placeholder="e.g. johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r].label}</option>)}
                </select>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{ROLE_DESC[form.role]}</p>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
