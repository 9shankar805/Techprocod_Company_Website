"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Search, Phone, Mail, MapPin, Calendar, DollarSign, Eye } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  jobTitle: string;
  employeeId: string;
  salary: string;
  salaryType: "Monthly" | "Hourly";
  hireDate: string;
  status: "Active" | "On Leave" | "Terminated";
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  gender: "Male" | "Female" | "Other";
  dob: string;
  emergencyContact: string;
  notes: string;
};

const EMPTY: Omit<Employee, "id"> = {
  name: "", email: "", phone: "", address: "", department: "Engineering",
  jobTitle: "", employeeId: "", salary: "", salaryType: "Monthly",
  hireDate: new Date().toISOString().split("T")[0], status: "Active",
  type: "Full-time", gender: "Male", dob: "", emergencyContact: "", notes: "",
};

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "Support", "HR", "Finance", "Operations"];
const statusStyle: Record<string, { bg: string; color: string }> = {
  Active:     { bg: "#f0fdf4", color: "#059669" },
  "On Leave": { bg: "#fffbeb", color: "#d97706" },
  Terminated: { bg: "#fef2f2", color: "#ef4444" },
};
const typeColor: Record<string, string> = {
  "Full-time": "#2563eb", "Part-time": "#7c3aed", Internship: "#d97706", Contract: "#0891b2",
};

export default function EmployeesPage() {
  const { role, name } = useAdminSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState<Employee | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, "id">>(EMPTY);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [tab, setTab] = useState<"personal" | "job" | "emergency">("personal");

  useEffect(() => {
    fetch("/api/admin/employees").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setEmployees(data);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setTab("personal"); setModal(true); };
  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({ name: e.name, email: e.email, phone: e.phone, address: e.address, department: e.department, jobTitle: e.jobTitle, employeeId: e.employeeId, salary: e.salary, salaryType: e.salaryType, hireDate: e.hireDate, status: e.status, type: e.type, gender: e.gender, dob: e.dob, emergencyContact: e.emergencyContact, notes: e.notes });
    setTab("personal");
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.jobTitle.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setEmployees(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e));
    } else {
      const res = await fetch("/api/admin/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setEmployees(prev => [{ id, ...form }, ...prev]);
    }
    setSaving(false);
    setModal(false);
  };

  const terminate = async (emp: Employee) => {
    if (!confirm(`Terminate ${emp.name}?`)) return;
    await fetch("/api/admin/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: emp.id, status: "Terminated" }) });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "Terminated" } : e));
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this employee record?")) return;
    await fetch("/api/admin/employees", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q);
    const matchDept = filterDept === "All" || e.department === filterDept;
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const active = employees.filter(e => e.status === "Active").length;
  const onLeave = employees.filter(e => e.status === "On Leave").length;
  const terminated = employees.filter(e => e.status === "Terminated").length;

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Employees</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{employees.length} total · {active} active · {onLeave} on leave · {terminated} terminated</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Hire Employee
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: employees.length, color: "#2563eb", bg: "#eff6ff" },
            { label: "Active", value: active, color: "#059669", bg: "#f0fdf4" },
            { label: "On Leave", value: onLeave, color: "#d97706", bg: "#fffbeb" },
            { label: "Terminated", value: terminated, color: "#ef4444", bg: "#fef2f2" },
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
            <input placeholder="Search name, email, ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ minWidth: 140 }}>
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: 130 }}>
            {["All", "Active", "On Leave", "Terminated"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Employee", "Department", "Job Title", "Type", "Hire Date", "Salary", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(emp => (
                <tr key={emp.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{emp.name}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af" }}>{emp.employeeId || emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{emp.department}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{emp.jobTitle}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: typeColor[emp.type] || "#374151", background: (typeColor[emp.type] || "#374151") + "15", padding: "2px 8px", borderRadius: 100 }}>{emp.type}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{emp.hireDate}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>
                    {emp.salary ? `NPR ${Number(emp.salary).toLocaleString()}` : "—"}
                    <span style={{ fontSize: 11, color: "#9ca3af" }}> /{emp.salaryType === "Monthly" ? "mo" : "hr"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100, background: statusStyle[emp.status].bg, color: statusStyle[emp.status].color }}>{emp.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setViewModal(emp)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#6b7280" }}><Eye size={13} /></button>
                      <button onClick={() => openEdit(emp)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                      {emp.status !== "Terminated" && (
                        <button onClick={() => terminate(emp)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fde68a", background: "#fffbeb", cursor: "pointer", color: "#d97706", fontSize: 11, fontWeight: 500 }}>Terminate</button>
                      )}
                      <button onClick={() => remove(emp.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{viewModal.name.charAt(0)}</div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{viewModal.name}</h2>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{viewModal.jobTitle} · {viewModal.department}</p>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Employee ID", value: viewModal.employeeId || "—" },
                { label: "Status", value: viewModal.status },
                { label: "Type", value: viewModal.type },
                { label: "Hire Date", value: viewModal.hireDate },
                { label: "Salary", value: viewModal.salary ? `NPR ${Number(viewModal.salary).toLocaleString()} / ${viewModal.salaryType}` : "—" },
                { label: "Gender", value: viewModal.gender },
                { label: "Date of Birth", value: viewModal.dob || "—" },
                { label: "Phone", value: viewModal.phone || "—" },
                { label: "Email", value: viewModal.email || "—" },
                { label: "Address", value: viewModal.address || "—" },
                { label: "Emergency Contact", value: viewModal.emergencyContact || "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ gridColumn: label === "Address" || label === "Emergency Contact" ? "1 / -1" : undefined }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{value}</p>
                </div>
              ))}
              {viewModal.notes && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Notes</p>
                  <p style={{ fontSize: 13, color: "#374151", background: "#f9fafb", padding: 10, borderRadius: 8, lineHeight: 1.6 }}>{viewModal.notes}</p>
                </div>
              )}
            </div>
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
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 580, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Employee" : "Hire New Employee"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, padding: "12px 24px 0", borderBottom: "1px solid #e5e7eb" }}>
              {(["personal", "job", "emergency"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, border: "none", background: "none", cursor: "pointer", color: tab === t ? "#2563eb" : "#6b7280", borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent", textTransform: "capitalize" }}>
                  {t === "emergency" ? "Emergency" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {tab === "personal" && <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <F label="Full Name *"><input placeholder="e.g. Ram Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
                  <F label="Employee ID"><input placeholder="e.g. EMP-001" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} /></F>
                  <F label="Email"><input type="email" placeholder="ram@techprocod.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></F>
                  <F label="Phone"><input placeholder="+977-98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></F>
                  <F label="Gender">
                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as Employee["gender"] })}>
                      {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </F>
                  <F label="Date of Birth"><input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></F>
                </div>
                <F label="Address"><input placeholder="Siraha, Province 2, Nepal" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></F>
              </>}

              {tab === "job" && <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <F label="Job Title *"><input placeholder="e.g. Full Stack Developer" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} /></F>
                  <F label="Department">
                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </F>
                  <F label="Employment Type">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Employee["type"] })}>
                      {["Full-time", "Part-time", "Internship", "Contract"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </F>
                  <F label="Status">
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Employee["status"] })}>
                      {["Active", "On Leave", "Terminated"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </F>
                  <F label="Hire Date"><input type="date" value={form.hireDate} onChange={e => setForm({ ...form, hireDate: e.target.value })} /></F>
                  <F label="Salary (NPR)"><input type="number" placeholder="e.g. 35000" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></F>
                  <F label="Salary Type">
                    <select value={form.salaryType} onChange={e => setForm({ ...form, salaryType: e.target.value as Employee["salaryType"] })}>
                      <option>Monthly</option>
                      <option>Hourly</option>
                    </select>
                  </F>
                </div>
                <F label="Notes / Remarks">
                  <textarea rows={3} placeholder="Any additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "vertical" }} />
                </F>
              </>}

              {tab === "emergency" && <>
                <F label="Emergency Contact Name & Phone">
                  <input placeholder="e.g. Sita Sharma — +977-98XXXXXXXX" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                </F>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>This information is kept confidential and used only in emergencies.</p>
              </>}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : editing ? "Update" : "Hire Employee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
