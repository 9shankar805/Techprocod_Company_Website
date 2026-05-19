"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Employee = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  status: string;
  type: string;
};

const DEPT_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Engineering:  { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Design:       { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
  Marketing:    { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Sales:        { bg: "#f0fdf4", color: "#059669", border: "#bbf7d0" },
  Support:      { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  HR:           { bg: "#fdf2f8", color: "#db2777", border: "#fbcfe8" },
  Finance:      { bg: "#f0fdfa", color: "#0d9488", border: "#99f6e4" },
  Operations:   { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" },
};

export default function OrgChartPage() {
  const { role, name } = useAdminSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/employees").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setEmployees(d.filter((e: Employee) => e.status !== "Terminated"));
      setLoading(false);
    });
  }, []);

  const departments = Array.from(new Set(employees.map(e => e.department))).sort();

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Org Chart</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            {employees.length} active employees across {departments.length} departments
          </p>
        </div>

        {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>}

        {!loading && employees.length === 0 && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 60, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            No active employees yet. Add employees first.
          </div>
        )}

        {!loading && departments.map(dept => {
          const deptEmployees = employees.filter(e => e.department === dept);
          const style = DEPT_COLORS[dept] ?? { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" };
          return (
            <div key={dept} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ height: 1, flex: 1, background: "#e5e7eb" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: style.color, background: style.bg, border: `1px solid ${style.border}`, padding: "4px 14px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {dept} · {deptEmployees.length}
                </span>
                <div style={{ height: 1, flex: 1, background: "#e5e7eb" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {deptEmployees.map(emp => (
                  <div key={emp.id} style={{ background: "white", border: `1px solid ${style.border}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: style.bg, border: `2px solid ${style.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: style.color, margin: "0 auto 10px" }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{emp.name}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{emp.jobTitle}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: style.color, background: style.bg, padding: "2px 8px", borderRadius: 100 }}>{emp.type}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
