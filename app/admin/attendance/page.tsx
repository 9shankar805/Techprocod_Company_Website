"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, X, Save, Search, Clock, Trash2, Download } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Attendance = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: string;
  status: "Present" | "Absent" | "Late" | "Half Day" | "On Leave";
  note: string;
};

const EMPTY: Omit<Attendance, "id"> = {
  employeeName: "", employeeId: "", department: "Engineering",
  date: new Date().toISOString().split("T")[0],
  checkIn: "09:00", checkOut: "18:00", hoursWorked: "9",
  status: "Present", note: "",
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  Present:   { bg: "#f0fdf4", color: "#059669" },
  Absent:    { bg: "#fef2f2", color: "#ef4444" },
  Late:      { bg: "#fffbeb", color: "#d97706" },
  "Half Day":{ bg: "#eff6ff", color: "#2563eb" },
  "On Leave":{ bg: "#faf5ff", color: "#7c3aed" },
};

function calcHours(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return "";
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins <= 0) return "";
  return (mins / 60).toFixed(1);
}

export default function AttendancePage() {
  const { role, name } = useAdminSession();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [form, setForm] = useState<Omit<Attendance, "id">>(EMPTY);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetch("/api/admin/attendance").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRecords(data);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, date: filterDate }); setModal(true); };
  const openEdit = (r: Attendance) => { setEditing(r); setForm({ employeeName: r.employeeName, employeeId: r.employeeId, department: r.department, date: r.date, checkIn: r.checkIn, checkOut: r.checkOut, hoursWorked: r.hoursWorked, status: r.status, note: r.note }); setModal(true); };

  const save = async () => {
    if (!form.employeeName.trim() || !form.date) return;
    setSaving(true);
    const hours = calcHours(form.checkIn, form.checkOut) || form.hoursWorked;
    const payload = { ...form, hoursWorked: hours };
    if (editing) {
      await fetch("/api/admin/attendance", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...payload }) });
      setRecords(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
    } else {
      const res = await fetch("/api/admin/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { id } = await res.json();
      setRecords(prev => [{ id, ...payload }, ...prev]);
    }
    setSaving(false);
    setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/attendance", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.employeeName.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchDate = !filterDate || r.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const todayRecords = records.filter(r => r.date === new Date().toISOString().split("T")[0]);
  const presentToday = todayRecords.filter(r => r.status === "Present" || r.status === "Late").length;
  const absentToday = todayRecords.filter(r => r.status === "Absent").length;

  const exportCSV = () => {
    const headers = ["Employee", "ID", "Department", "Date", "Check In", "Check Out", "Hours", "Status", "Note"];
    const rows = filtered.map(r => [r.employeeName, r.employeeId, r.department, r.date, r.checkIn, r.checkOut, r.hoursWorked, r.status, r.note]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `attendance-${filterDate || "all"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Attendance</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Today: {presentToday} present · {absentToday} absent</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Mark Attendance
          </button>
          <button onClick={exportCSV} className="btn-outline" style={{ fontSize: 13, padding: "9px 14px" }}><Download size={14} /> Export CSV</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
          {(["Present", "Absent", "Late", "Half Day", "On Leave"] as const).map(s => (
            <div key={s} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{s}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: statusStyle[s].color }}>
                {todayRecords.filter(r => r.status === s).length}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>today</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ minWidth: 150 }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: 130 }}>
            <option value="All">All Status</option>
            {["Present", "Absent", "Late", "Half Day", "On Leave"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setFilterDate("")} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: "#6b7280" }}>All Dates</button>
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Employee", "Department", "Date", "Check In", "Check Out", "Hours", "Status", "Note", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(r => (
                <tr key={r.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{r.employeeName}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>{r.employeeId}</p>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{r.department}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{r.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#059669" }}>
                      <Clock size={12} />{r.checkIn || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#ef4444" }}>
                      <Clock size={12} />{r.checkOut || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.hoursWorked ? `${r.hoursWorked}h` : "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100, background: statusStyle[r.status].bg, color: statusStyle[r.status].color }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af", maxWidth: 120 }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.note || "—"}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(r)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151", fontSize: 11, fontWeight: 500 }}>Edit</button>
                      <button onClick={() => remove(r.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No attendance records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Record" : "Mark Attendance"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Employee Name *", key: "employeeName", placeholder: "Full name" },
                  { label: "Employee ID", key: "employeeId", placeholder: "EMP-001" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>
                    <input placeholder={placeholder} value={(form as Record<string, string>)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {["Engineering", "Design", "Marketing", "Sales", "Support", "HR", "Finance", "Operations"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Check In</label>
                  <input type="time" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value, hoursWorked: calcHours(e.target.value, form.checkOut) })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Check Out</label>
                  <input type="time" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value, hoursWorked: calcHours(form.checkIn, e.target.value) })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Attendance["status"] })}>
                    {["Present", "Absent", "Late", "Half Day", "On Leave"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {form.hoursWorked && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#059669", fontWeight: 600 }}>
                    <Clock size={14} /> {form.hoursWorked}h worked
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>Note</label>
                <input placeholder="Optional note..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
