"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Search, Mail, Phone, Eye } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  status: "Active" | "Inactive" | "Prospect";
  totalProjects: number;
  totalValue: string;
  notes: string;
  createdAt: string;
};

const EMPTY: Omit<Client, "id" | "createdAt"> = {
  name: "", company: "", email: "", phone: "", address: "",
  industry: "Technology", status: "Active", totalProjects: 0, totalValue: "", notes: "",
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  Active:   { bg: "#f0fdf4", color: "#059669" },
  Inactive: { bg: "#f9fafb", color: "#9ca3af" },
  Prospect: { bg: "#eff6ff", color: "#2563eb" },
};

const INDUSTRIES = ["Technology", "Retail", "Hospitality", "Education", "Healthcare", "Finance", "Real Estate", "Food & Beverage", "Transport", "Other"];

export default function ClientsPage() {
  const { role, name } = useAdminSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState<Client | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<Omit<Client, "id" | "createdAt">>(EMPTY);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("/api/admin/clients").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setClients(d);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c: Client) => { setEditing(c); setForm({ ...c }); setModal(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/clients", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setClients(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const res = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setClients(prev => [{ id, ...form, createdAt: new Date().toISOString() }, ...prev]);
    }
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await fetch("/api/admin/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || c.status === filterStatus);
  });

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Clients</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{clients.length} total · {clients.filter(c => c.status === "Active").length} active</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> Add Client</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: clients.length, color: "#2563eb" },
            { label: "Active", value: clients.filter(c => c.status === "Active").length, color: "#059669" },
            { label: "Prospects", value: clients.filter(c => c.status === "Prospect").length, color: "#2563eb" },
            { label: "Inactive", value: clients.filter(c => c.status === "Inactive").length, color: "#9ca3af" },
          ].map(s => (
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
            <input placeholder="Search name, company, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "Active", "Prospect", "Inactive"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filterStatus === s ? "#111827" : "white", color: filterStatus === s ? "white" : "#374151", borderColor: filterStatus === s ? "#111827" : "#e5e7eb" }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Client", "Industry", "Projects", "Total Value", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{c.name}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af" }}>{c.company || c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{c.industry}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.totalProjects}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#059669", fontWeight: 600 }}>
                    {c.totalValue ? `NPR ${Number(c.totalValue).toLocaleString()}` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: statusStyle[c.status].bg, color: statusStyle[c.status].color }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setViewModal(c)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#6b7280" }}><Eye size={13} /></button>
                      <button onClick={() => openEdit(c)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                      <button onClick={() => remove(c.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No clients found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{viewModal.name}</h2>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{viewModal.company}</p>
              </div>
              <button onClick={() => setViewModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              {[
                ["Industry", viewModal.industry], ["Status", viewModal.status],
                ["Projects", String(viewModal.totalProjects)], ["Total Value", viewModal.totalValue ? `NPR ${Number(viewModal.totalValue).toLocaleString()}` : "—"],
              ].map(([k, v]) => (
                <div key={k}><p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{k}</p><p style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{v}</p></div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <a href={`mailto:${viewModal.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Mail size={13} />{viewModal.email}</a>
              {viewModal.phone && <a href={`tel:${viewModal.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Phone size={13} />{viewModal.phone}</a>}
              {viewModal.address && <p style={{ fontSize: 13, color: "#6b7280" }}>📍 {viewModal.address}</p>}
            </div>
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
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Client" : "Add Client"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Contact Name *"><input placeholder="e.g. Ramesh Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
                <F label="Company Name"><input placeholder="e.g. Siraha Bazaar" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></F>
                <F label="Email"><input type="email" placeholder="client@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></F>
                <F label="Phone"><input placeholder="+977-98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></F>
                <F label="Industry">
                  <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </F>
                <F label="Status">
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Client["status"] })}>
                    {["Active", "Prospect", "Inactive"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </F>
                <F label="Total Projects"><input type="number" value={form.totalProjects} onChange={e => setForm({ ...form, totalProjects: Number(e.target.value) })} /></F>
                <F label="Total Value (NPR)"><input type="number" placeholder="e.g. 250000" value={form.totalValue} onChange={e => setForm({ ...form, totalValue: e.target.value })} /></F>
              </div>
              <F label="Address"><input placeholder="City, Province, Nepal" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></F>
              <F label="Notes"><textarea rows={3} placeholder="Client notes, preferences..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "vertical" }} /></F>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : editing ? "Update" : "Add Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
