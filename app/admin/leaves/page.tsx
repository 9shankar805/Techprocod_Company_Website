"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, X, Save, Search, Check, XCircle, Trash2 } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Leave = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  reviewNote: string;
  createdAt: string;
};

const EMPTY: Omit<Leave, "id" | "status" | "reviewNote" | "createdAt"> = {
  employeeName: "", employeeId: "", department: "Engineering",
  leaveType: "Annual Leave", fromDate: "", toDate: "", days: 1, reason: "",
};

const LEAVE_TYPES = ["Annual Leave", "Sick Leave", "Casual Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave", "Emergency Leave"];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Pending:  { bg: "#fffbeb", color: "#d97706" },
  Approved: { bg: "#f0fdf4", color: "#059669" },
  Rejected: { bg: "#fef2f2", color: "#ef4444" },
};

export default function LeavesPage() {
  const { role, name } = useAdminSession();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [reviewModal, setReviewModal] = useState<Leave | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [form, setForm] = useState<Omit<Leave, "id" | "status" | "reviewNote" | "createdAt">>(EMPTY);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("/api/admin/leaves").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setLeaves(data);
      setLoading(false);
    });
  }, []);

  const calcDays = (from: string, to: string) => {
    if (!from || !to) return 1;
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const save = async () => {
    if (!form.employeeName.trim() || !form.fromDate || !form.toDate) return;
    setSaving(true);
    const payload = { ...form, days: calcDays(form.fromDate, form.toDate) };
    const res = await fetch("/api/admin/leaves", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const { id } = await res.json();
    setLeaves(prev => [{ id, ...payload, status: "Pending", reviewNote: "", createdAt: new Date().toISOString() }, ...prev]);
    setSaving(false);
    setModal(false);
  };

  const review = async (status: "Approved" | "Rejected") => {
    if (!reviewModal) return;
    await fetch("/api/admin/leaves", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: reviewModal.id, status, reviewNote }) });
    setLeaves(prev => prev.map(l => l.id === reviewModal.id ? { ...l, status, reviewNote } : l));
    setReviewModal(null);
    setReviewNote("");
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/leaves", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setLeaves(prev => prev.filter(l => l.id !== id));
  };

  const filtered = leaves.filter(l => {
    const q = search.toLowerCase();
    return (l.employeeName.toLowerCase().includes(q) || l.leaveType.toLowerCase().includes(q)) &&
      (filterStatus === "All" || l.status === filterStatus);
  });

  const pending = leaves.filter(l => l.status === "Pending").length;

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Leave Requests</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{leaves.length} total · {pending} pending review</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setModal(true); }} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Add Request
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: leaves.length, color: "#2563eb" },
            { label: "Pending", value: pending, color: "#d97706" },
            { label: "Approved", value: leaves.filter(l => l.status === "Approved").length, color: "#059669" },
            { label: "Rejected", value: leaves.filter(l => l.status === "Rejected").length, color: "#ef4444" },
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
            <input placeholder="Search employee or leave type..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "Pending", "Approved", "Rejected"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", cursor: "pointer", background: filterStatus === s ? "#2563eb" : "white", color: filterStatus === s ? "white" : "#374151", borderColor: filterStatus === s ? "#2563eb" : "#e5e7eb" }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Employee", "Leave Type", "From", "To", "Days", "Reason", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(l => (
                <tr key={l.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{l.employeeName}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>{l.department}</p>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{l.leaveType}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{l.fromDate}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{l.toDate}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{l.days}d</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", maxWidth: 180 }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100, background: statusStyle[l.status].bg, color: statusStyle[l.status].color }}>{l.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {l.status === "Pending" && (
                        <button onClick={() => { setReviewModal(l); setReviewNote(""); }} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bbf7d0", background: "#f0fdf4", cursor: "pointer", color: "#059669", fontSize: 12, fontWeight: 500 }}>Review</button>
                      )}
                      <button onClick={() => remove(l.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No leave requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 460 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Review Leave Request</h2>
              <button onClick={() => setReviewModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Employee", reviewModal.employeeName],
                ["Department", reviewModal.department],
                ["Leave Type", reviewModal.leaveType],
                ["Period", `${reviewModal.fromDate} → ${reviewModal.toDate} (${reviewModal.days} days)`],
                ["Reason", reviewModal.reason],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 90 }}>{k}</span>
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Review Note (optional)</label>
              <textarea rows={3} placeholder="Add a note for the employee..." value={reviewNote} onChange={e => setReviewNote(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => review("Rejected")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#ef4444" }}>
                <XCircle size={15} /> Reject
              </button>
              <button onClick={() => review("Approved")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 8, border: "none", background: "#059669", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>
                <Check size={15} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Add Leave Request</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Employee Name *</label>
                  <input placeholder="Full name" value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Employee ID</label>
                  <input placeholder="EMP-001" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {["Engineering", "Design", "Marketing", "Sales", "Support", "HR", "Finance", "Operations"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Leave Type</label>
                  <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}>
                    {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>From Date *</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>To Date *</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Reason</label>
                <textarea rows={3} placeholder="Reason for leave..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
