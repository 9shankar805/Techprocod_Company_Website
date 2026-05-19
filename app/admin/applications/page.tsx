"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Search, Trash2, X, Mail, Phone, FileText } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: string;
  coverLetter: string;
  portfolio: string;
  status: "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  New:        { bg: "#eff6ff", color: "#2563eb" },
  Reviewing:  { bg: "#fffbeb", color: "#d97706" },
  Shortlisted:{ bg: "#f0fdf4", color: "#059669" },
  Rejected:   { bg: "#fef2f2", color: "#ef4444" },
  Hired:      { bg: "#faf5ff", color: "#7c3aed" },
};

const STATUSES = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"] as const;

export default function ApplicationsPage() {
  const { role, name } = useAdminSession();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("/api/admin/applications").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setApps(d);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/applications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: status as Application["status"] } : a));
    setSelected(prev => prev?.id === id ? { ...prev, status: status as Application["status"] } : prev);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/applications", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setApps(prev => prev.filter(a => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    return (a.name.toLowerCase().includes(q) || a.jobTitle.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || a.status === filterStatus);
  });

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<string, number>);

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Job Applications</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{apps.length} total · {counts["New"] || 0} new</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
          {STATUSES.map(s => (
            <div key={s} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{s}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: statusStyle[s].color }}>{counts[s] || 0}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search name, job, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filterStatus === s ? "#111827" : "white", color: filterStatus === s ? "white" : "#374151", borderColor: filterStatus === s ? "#111827" : "#e5e7eb" }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Applicant", "Job Title", "Experience", "Applied", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
                {!loading && filtered.map(a => (
                  <tr key={a.id} onClick={() => setSelected(a)} style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer", background: selected?.id === a.id ? "#f8faff" : "white" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{a.name}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>{a.email}</p>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{a.jobTitle}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{a.experience || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: statusStyle[a.status]?.bg, color: statusStyle[a.status]?.color }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {role === "superadmin" && (
                        <button onClick={e => { e.stopPropagation(); remove(a.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}><Trash2 size={13} /></button>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No applications found</td></tr>}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, height: "fit-content" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Application Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 20 }}>×</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Applicant</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{selected.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Applied For</p>
                  <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{selected.jobTitle}</p>
                </div>
                <a href={`mailto:${selected.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Mail size={13} />{selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Phone size={13} />{selected.phone}</a>}
                {selected.experience && <div><p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Experience</p><p style={{ fontSize: 13, color: "#374151" }}>{selected.experience}</p></div>}
                {selected.portfolio && (
                  <div>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Portfolio / GitHub</p>
                    <a href={selected.portfolio} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#2563eb", display: "flex", alignItems: "center", gap: 5 }}><FileText size={12} />{selected.portfolio}</a>
                  </div>
                )}
                {selected.coverLetter && (
                  <div>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Cover Letter</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, background: "#f9fafb", padding: 12, borderRadius: 8 }}>{selected.coverLetter}</p>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Update Status</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid", cursor: "pointer", background: selected.status === s ? statusStyle[s].bg : "white", color: selected.status === s ? statusStyle[s].color : "#374151", borderColor: selected.status === s ? statusStyle[s].color : "#e5e7eb" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: Your Application for ${selected.jobTitle}&body=Hi ${selected.name},%0D%0A%0D%0AThank you for applying to Tech Procod.`} className="btn-primary" style={{ justifyContent: "center", fontSize: 13, marginTop: 4 }}>
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
