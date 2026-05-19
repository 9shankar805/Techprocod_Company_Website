"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Search, Activity } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  detail: string;
  timestamp: string;
};

const actionColor: Record<string, string> = {
  created: "#059669", updated: "#2563eb", deleted: "#ef4444",
  approved: "#059669", rejected: "#ef4444", login: "#7c3aed",
};

export default function AuditPage() {
  const { role, name } = useAdminSession();
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("All");

  useEffect(() => {
    fetch("/api/admin/audit").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setLog(d);
      setLoading(false);
    });
  }, []);

  const filtered = log.filter(e => {
    const q = search.toLowerCase();
    return (e.actor.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q)) &&
      (filterAction === "All" || e.action === filterAction);
  });

  const actions = ["All", ...Array.from(new Set(log.map(e => e.action)))];

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Audit Log</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{log.length} total activity records</p>
          </div>
          <Activity size={18} color="#9ca3af" />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search actor, entity, detail..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{ minWidth: 140 }}>
            {actions.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Time", "Actor", "Action", "Entity", "Detail"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(e => (
                <tr key={e.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {e.timestamp ? new Date(e.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{e.actor}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: actionColor[e.action] ?? "#374151", background: (actionColor[e.action] ?? "#374151") + "15", padding: "2px 8px", borderRadius: 100 }}>{e.action}</span>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#6b7280" }}>{e.entity}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151", maxWidth: 300 }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.detail}</p>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No audit records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
