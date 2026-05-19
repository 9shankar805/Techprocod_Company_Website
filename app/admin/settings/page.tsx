"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Save, Building2, Clock, Users } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

const DEFAULTS = {
  company: {
    name: "Tech Procod Pvt Ltd", email: "info@techprocod.com",
    phone: "+977-9800000000", address: "Siraha, Madhesh Pradesh, Nepal",
    website: "https://techprocod.com", founded: "2022",
    tagline: "Building Digital Nepal", currency: "NPR",
    timezone: "Asia/Kathmandu", fiscalYearStart: "Shrawan (July)",
  },
  workHours: {
    start: "09:00", end: "18:00", workDays: "Sunday - Friday",
    lunchBreak: "13:00 - 14:00", annualLeave: "18", sickLeave: "12", casualLeave: "6",
  },
  departments: "Engineering\nDesign\nMarketing\nSales\nSupport\nHR\nFinance\nOperations",
};

export default function SettingsPage() {
  const { role, name } = useAdminSession();
  const [company, setCompany] = useState(DEFAULTS.company);
  const [workHours, setWorkHours] = useState(DEFAULTS.workHours);
  const [departments, setDepartments] = useState(DEFAULTS.departments);
  const [activeTab, setActiveTab] = useState<"company" | "hr" | "departments">("company");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(d => {
      if (d.company) setCompany({ ...DEFAULTS.company, ...d.company });
      if (d.workHours) setWorkHours({ ...DEFAULTS.workHours, ...d.workHours });
      if (d.departments) setDepartments(d.departments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, workHours, departments }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  if (loading) return <AdminShell role={role} name={name}><p style={{ color: "#9ca3af" }}>Loading settings...</p></AdminShell>;

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Settings</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Configure company profile and system preferences — saved to Firestore</p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 24 }}>
          {([
            { key: "company", label: "Company Profile", icon: Building2 },
            { key: "hr", label: "HR & Leave Policy", icon: Clock },
            { key: "departments", label: "Departments", icon: Users },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", fontSize: 13, fontWeight: 500, border: "none", background: "none", cursor: "pointer", color: activeTab === key ? "#2563eb" : "#6b7280", borderBottom: activeTab === key ? "2px solid #2563eb" : "2px solid transparent" }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 28 }}>
          {activeTab === "company" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <F label="Company Name"><input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} /></F>
                <F label="Tagline"><input value={company.tagline} onChange={e => setCompany({ ...company, tagline: e.target.value })} /></F>
                <F label="Email"><input type="email" value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} /></F>
                <F label="Phone"><input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} /></F>
                <F label="Website"><input value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} /></F>
                <F label="Founded Year"><input value={company.founded} onChange={e => setCompany({ ...company, founded: e.target.value })} /></F>
                <F label="Currency">
                  <select value={company.currency} onChange={e => setCompany({ ...company, currency: e.target.value })}>
                    {["NPR", "USD", "INR"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </F>
                <F label="Timezone">
                  <select value={company.timezone} onChange={e => setCompany({ ...company, timezone: e.target.value })}>
                    {["Asia/Kathmandu", "Asia/Kolkata", "UTC"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </F>
              </div>
              <F label="Address"><input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} /></F>
              <F label="Fiscal Year Start"><input value={company.fiscalYearStart} onChange={e => setCompany({ ...company, fiscalYearStart: e.target.value })} /></F>
            </div>
          )}

          {activeTab === "hr" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Configure working hours and leave entitlements</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <F label="Work Start Time"><input type="time" value={workHours.start} onChange={e => setWorkHours({ ...workHours, start: e.target.value })} /></F>
                <F label="Work End Time"><input type="time" value={workHours.end} onChange={e => setWorkHours({ ...workHours, end: e.target.value })} /></F>
                <F label="Working Days"><input value={workHours.workDays} onChange={e => setWorkHours({ ...workHours, workDays: e.target.value })} /></F>
                <F label="Lunch Break"><input value={workHours.lunchBreak} onChange={e => setWorkHours({ ...workHours, lunchBreak: e.target.value })} /></F>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Annual Leave Entitlements (days)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <F label="Annual Leave"><input type="number" value={workHours.annualLeave} onChange={e => setWorkHours({ ...workHours, annualLeave: e.target.value })} /></F>
                  <F label="Sick Leave"><input type="number" value={workHours.sickLeave} onChange={e => setWorkHours({ ...workHours, sickLeave: e.target.value })} /></F>
                  <F label="Casual Leave"><input type="number" value={workHours.casualLeave} onChange={e => setWorkHours({ ...workHours, casualLeave: e.target.value })} /></F>
                </div>
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 13, color: "#6b7280" }}>One department per line. These appear in employee and attendance forms.</p>
              <textarea rows={12} value={departments} onChange={e => setDepartments(e.target.value)} style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {departments.split("\n").filter(Boolean).map(d => (
                  <span key={d} style={{ fontSize: 12, background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: 100, fontWeight: 500 }}>{d.trim()}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: 13, padding: "9px 20px" }}>
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span style={{ fontSize: 13, color: "#059669", fontWeight: 500 }}>✓ Saved to Firestore</span>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
