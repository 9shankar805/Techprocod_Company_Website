"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Search, Mail, Phone, Trash2 } from "lucide-react";
import type { Role } from "@/lib/adminAuth";

const INITIAL_INQUIRIES = [
  { id: 1, name: "Ramesh Sharma",  email: "ramesh@example.com",  phone: "+977-9812345678", service: "Web Development", message: "I need a website for my business. Please contact me.",                    date: "Dec 15, 2024", status: "New" },
  { id: 2, name: "Priya Thapa",    email: "priya@example.com",   phone: "+977-9823456789", service: "Mobile App",      message: "Looking for a React Native developer for my startup app.",              date: "Dec 14, 2024", status: "Replied" },
  { id: 3, name: "Bikash Yadav",   email: "bikash@example.com",  phone: "+977-9834567890", service: "E-commerce",      message: "Want to build an online store for my clothing brand.",                  date: "Dec 13, 2024", status: "New" },
  { id: 4, name: "Sunita Jha",     email: "sunita@example.com",  phone: "+977-9845678901", service: "UI/UX Design",    message: "Need a redesign for my hotel website.",                                 date: "Dec 12, 2024", status: "Closed" },
  { id: 5, name: "Anil Kumar",     email: "anil@example.com",    phone: "+977-9856789012", service: "SEO & Marketing", message: "My website is not ranking on Google. Need help with SEO.",              date: "Dec 11, 2024", status: "New" },
  { id: 6, name: "Sita Devi",      email: "sita@example.com",    phone: "+977-9867890123", service: "Custom Software", message: "Need a POS system for my retail shop.",                                 date: "Dec 10, 2024", status: "Replied" },
];

type Inquiry = typeof INITIAL_INQUIRIES[0];

const statusStyle: Record<string, { bg: string; text: string }> = {
  New:     { bg: "#eff6ff", text: "#2563eb" },
  Replied: { bg: "#f0fdf4", text: "#059669" },
  Closed:  { bg: "#f9fafb", text: "#9ca3af" },
};

export default function InquiriesPage() {
  const [role, setRole] = useState<Role>("support");
  const [name, setName] = useState("Support Staff");
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((d) => {
      if (d.role) setRole(d.role);
      if (d.name) setName(d.name);
    });
  }, []);

  const filtered = inquiries.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch = i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.service.toLowerCase().includes(q);
    return matchSearch && (filter === "All" || i.status === filter);
  });

  const updateStatus = (id: number, status: string) => {
    setInquiries((p) => p.map((i) => i.id === id ? { ...i, status } : i));
    setSelected((p) => p?.id === id ? { ...p, status } : p);
  };

  const del = (id: number) => { setInquiries((p) => p.filter((i) => i.id !== id)); if (selected?.id === id) setSelected(null); };

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Inquiries</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage contact form submissions</p>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "New", "Replied", "Closed"].map((s) => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filter === s ? "#2563eb" : "white", color: filter === s ? "white" : "#374151", borderColor: filter === s ? "#2563eb" : "#e5e7eb" }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Name", "Service", "Date", "Status", ""].map((h, i) => (
                    <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} onClick={() => setSelected(row)} style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer", background: selected?.id === row.id ? "#f8faff" : "white" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{row.name}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af" }}>{row.email}</p>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{row.service}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#9ca3af" }}>{row.date}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: statusStyle[row.status].text, background: statusStyle[row.status].bg, padding: "3px 10px", borderRadius: 100 }}>{row.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {role === "superadmin" && (
                        <button onClick={(e) => { e.stopPropagation(); del(row.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No inquiries found</td></tr>}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, height: "fit-content" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 20, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Name</p><p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{selected.name}</p></div>
                <a href={`mailto:${selected.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Mail size={13} />{selected.email}</a>
                <a href={`tel:${selected.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", textDecoration: "none" }}><Phone size={13} />{selected.phone}</a>
                <div><p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Service</p><p style={{ fontSize: 14, color: "#374151" }}>{selected.service}</p></div>
                <div><p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Message</p><p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, background: "#f9fafb", padding: 12, borderRadius: 8 }}>{selected.message}</p></div>
                <div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Update Status</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["New", "Replied", "Closed"].map((s) => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer", background: selected.status === s ? statusStyle[s].bg : "white", color: selected.status === s ? statusStyle[s].text : "#374151", borderColor: selected.status === s ? statusStyle[s].text : "#e5e7eb" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.service} Inquiry&body=Hi ${selected.name},%0D%0A%0D%0AThank you for reaching out to Tech Procod.`} className="btn-primary" style={{ justifyContent: "center", fontSize: 13, marginTop: 4 }}>
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
