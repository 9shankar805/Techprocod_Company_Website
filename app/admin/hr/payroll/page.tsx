"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Employee = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  salary: string;
  salaryType: string;
  status: string;
};

type Attendance = {
  employeeId: string;
  employeeName: string;
  date: string;
  status: string;
  hoursWorked: string;
};

type PayrollRow = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  baseSalary: number;
  salaryType: string;
  daysPresent: number;
  daysAbsent: number;
  hoursWorked: number;
  grossPay: number;
  deductions: number;
  netPay: number;
};

export default function PayrollPage() {
  const { role, name } = useAdminSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/employees").then(r => r.json()),
      fetch("/api/admin/attendance").then(r => r.json()),
    ]).then(([emps, att]) => {
      if (Array.isArray(emps)) setEmployees(emps.filter((e: Employee) => e.status === "Active"));
      if (Array.isArray(att)) setAttendance(att);
      setLoading(false);
    });
  }, []);

  const payroll: PayrollRow[] = employees.map(emp => {
    const monthAtt = attendance.filter(a =>
      (a.employeeId === emp.employeeId || a.employeeName === emp.name) &&
      a.date.startsWith(month)
    );
    const daysPresent = monthAtt.filter(a => a.status === "Present" || a.status === "Late").length;
    const daysAbsent = monthAtt.filter(a => a.status === "Absent").length;
    const hoursWorked = monthAtt.reduce((s, a) => s + (parseFloat(a.hoursWorked) || 0), 0);
    const baseSalary = Number(emp.salary) || 0;

    let grossPay = 0;
    if (emp.salaryType === "Hourly") {
      grossPay = baseSalary * hoursWorked;
    } else {
      // Monthly: deduct for absent days (assume 26 working days/month)
      const workingDays = 26;
      const perDay = baseSalary / workingDays;
      grossPay = baseSalary - (daysAbsent * perDay);
    }
    grossPay = Math.max(0, grossPay);
    const deductions = grossPay * 0.1; // 10% tax/PF
    const netPay = grossPay - deductions;

    return {
      id: emp.id,
      name: emp.name,
      employeeId: emp.employeeId,
      department: emp.department,
      jobTitle: emp.jobTitle,
      baseSalary,
      salaryType: emp.salaryType,
      daysPresent,
      daysAbsent,
      hoursWorked: Math.round(hoursWorked * 10) / 10,
      grossPay: Math.round(grossPay),
      deductions: Math.round(deductions),
      netPay: Math.round(netPay),
    };
  });

  const totalGross = payroll.reduce((s, r) => s + r.grossPay, 0);
  const totalDeductions = payroll.reduce((s, r) => s + r.deductions, 0);
  const totalNet = payroll.reduce((s, r) => s + r.netPay, 0);

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Payroll</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Auto-calculated from attendance · 10% deduction (tax/PF)</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ minWidth: 150 }} />
            <button onClick={() => {
              const headers = ["Name","Employee ID","Department","Job Title","Base Salary","Salary Type","Days Present","Days Absent","Hours Worked","Gross Pay","Deductions","Net Pay"];
              const rows = payroll.map(r => [r.name,r.employeeId,r.department,r.jobTitle,r.baseSalary,r.salaryType,r.daysPresent,r.daysAbsent,r.hoursWorked,r.grossPay,r.deductions,r.netPay]);
              const csv = [headers,...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
              const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download = `payroll-${month}.csv`; a.click();
            }} className="btn-outline" style={{ fontSize: 13, padding: "9px 14px" }}><Download size={14} /> Export CSV</button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Gross Pay", value: totalGross, icon: TrendingUp, color: "#059669", bg: "#f0fdf4" },
            { label: "Total Deductions", value: totalDeductions, icon: TrendingDown, color: "#ef4444", bg: "#fef2f2" },
            { label: "Total Net Pay", value: totalNet, icon: DollarSign, color: "#2563eb", bg: "#eff6ff" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={color} />
                </div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color }}>NPR {value.toLocaleString()}</p>
            </div>
          ))}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>Employees on Payroll</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{payroll.length}</p>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Employee", "Department", "Base Salary", "Days Present", "Days Absent", "Hours", "Gross Pay", "Deductions (10%)", "Net Pay"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && payroll.map(row => (
                <tr key={row.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{row.name}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>{row.jobTitle}</p>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{row.department}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                    NPR {row.baseSalary.toLocaleString()}
                    <span style={{ fontSize: 11, color: "#9ca3af" }}> /{row.salaryType === "Monthly" ? "mo" : "hr"}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#059669" }}>{row.daysPresent}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: row.daysAbsent > 0 ? "#ef4444" : "#9ca3af" }}>{row.daysAbsent}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{row.hoursWorked}h</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>NPR {row.grossPay.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#ef4444" }}>- NPR {row.deductions.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#059669" }}>NPR {row.netPay.toLocaleString()}</td>
                </tr>
              ))}
              {!loading && payroll.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No active employees found</td></tr>
              )}
              {!loading && payroll.length > 0 && (
                <tr style={{ borderTop: "2px solid #e5e7eb", background: "#f9fafb" }}>
                  <td colSpan={6} style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#374151" }}>TOTAL</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#111827" }}>NPR {totalGross.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#ef4444" }}>- NPR {totalDeductions.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#059669" }}>NPR {totalNet.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
