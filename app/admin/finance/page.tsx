"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Transaction = {
  id: string;
  type: "Income" | "Expense";
  category: string;
  description: string;
  amount: string;
  date: string;
  project: string;
  paymentMethod: string;
  reference: string;
};

const EMPTY: Omit<Transaction, "id"> = {
  type: "Income", category: "Project Payment", description: "",
  amount: "", date: new Date().toISOString().split("T")[0],
  project: "", paymentMethod: "Bank Transfer", reference: "",
};

const INCOME_CATS = ["Project Payment", "Consultation", "Maintenance", "Retainer", "Other Income"];
const EXPENSE_CATS = ["Salaries", "Software/Tools", "Infrastructure", "Marketing", "Office", "Travel", "Utilities", "Other Expense"];
const PAYMENT_METHODS = ["Bank Transfer", "eSewa", "Khalti", "Cash", "Cheque", "Other"];

export default function FinancePage() {
  const { role, name } = useAdminSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Transaction, "id">>(EMPTY);
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetch("/api/admin/finance").then(r => r.json()).then(d => { if (Array.isArray(d)) setTransactions(d); setLoading(false); });
  }, []);

  const save = async () => {
    if (!form.amount || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/admin/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const { id } = await res.json();
    setTransactions(prev => [{ id, ...form }, ...prev]);
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/finance", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filtered = transactions.filter(t => {
    const matchType = filterType === "All" || t.type === filterType;
    const matchMonth = !filterMonth || t.date.startsWith(filterMonth);
    return matchType && matchMonth;
  });

  const totalIncome = filtered.filter(t => t.type === "Income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filtered.filter(t => t.type === "Expense").reduce((s, t) => s + Number(t.amount), 0);
  const netProfit = totalIncome - totalExpense;

  const allIncome = transactions.filter(t => t.type === "Income").reduce((s, t) => s + Number(t.amount), 0);
  const allExpense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + Number(t.amount), 0);

  const exportCSV = () => {
    const headers = ["Date", "Type", "Category", "Description", "Project", "Payment Method", "Amount", "Reference"];
    const rows = filtered.map(t => [t.date, t.type, t.category, t.description, t.project, t.paymentMethod, t.amount, t.reference]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `finance-${filterMonth || "all"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Finance</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Track income, expenses and profitability</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setModal(true); }} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}><Plus size={15} /> Add Transaction</button>
          <button onClick={exportCSV} className="btn-outline" style={{ fontSize: 13, padding: "9px 14px" }}><Download size={14} /> Export CSV</button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Income", value: allIncome, icon: TrendingUp, color: "#059669", bg: "#f0fdf4" },
            { label: "Total Expenses", value: allExpense, icon: TrendingDown, color: "#ef4444", bg: "#fef2f2" },
            { label: "Net Profit", value: allIncome - allExpense, icon: DollarSign, color: allIncome - allExpense >= 0 ? "#059669" : "#ef4444", bg: allIncome - allExpense >= 0 ? "#f0fdf4" : "#fef2f2" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={color} />
                </div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color }}>{value < 0 ? "-" : ""}NPR {Math.abs(value).toLocaleString()}</p>
            </div>
          ))}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Profit Margin</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>
              {allIncome > 0 ? ((( allIncome - allExpense) / allIncome) * 100).toFixed(1) : "0"}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            {["All", "Income", "Expense"].map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{ padding: "7px 14px", fontSize: 13, border: "none", cursor: "pointer", background: filterType === t ? "#111827" : "white", color: filterType === t ? "white" : "#374151" }}>{t}</button>
            ))}
          </div>
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ minWidth: 150 }} />
          <button onClick={() => setFilterMonth("")} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13, color: "#6b7280" }}>All Time</button>
          {filterMonth && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 16, fontSize: 13 }}>
              <span style={{ color: "#059669", fontWeight: 600 }}>↑ NPR {totalIncome.toLocaleString()}</span>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>↓ NPR {totalExpense.toLocaleString()}</span>
              <span style={{ color: netProfit >= 0 ? "#059669" : "#ef4444", fontWeight: 700 }}>Net: NPR {netProfit.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Date", "Type", "Category", "Description", "Project", "Payment", "Amount", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading...</td></tr>}
              {!loading && filtered.map(t => (
                <tr key={t.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>{t.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: t.type === "Income" ? "#f0fdf4" : "#fef2f2", color: t.type === "Income" ? "#059669" : "#ef4444" }}>{t.type}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{t.category}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>{t.description}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{t.project || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af" }}>{t.paymentMethod}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: t.type === "Income" ? "#059669" : "#ef4444", whiteSpace: "nowrap" }}>
                    {t.type === "Income" ? "+" : "-"} NPR {Number(t.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => remove(t.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Add Transaction</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                {["Income", "Expense"].map(t => (
                  <button key={t} onClick={() => setForm({ ...form, type: t as Transaction["type"], category: t === "Income" ? INCOME_CATS[0] : EXPENSE_CATS[0] })} style={{ flex: 1, padding: "10px 0", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", background: form.type === t ? (t === "Income" ? "#059669" : "#ef4444") : "white", color: form.type === t ? "white" : "#374151" }}>{t}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Category"><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {(form.type === "Income" ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c}>{c}</option>)}
                </select></F>
                <F label="Amount (NPR) *"><input type="number" placeholder="e.g. 50000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></F>
                <F label="Date *"><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></F>
                <F label="Payment Method"><select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select></F>
              </div>
              <F label="Description *"><input placeholder="e.g. StyleAura project payment - Phase 1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></F>
              <F label="Related Project"><input placeholder="Project name (optional)" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} /></F>
              <F label="Reference / Invoice No."><input placeholder="e.g. INV-2024-001" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} /></F>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}><Save size={14} /> {saving ? "Saving..." : "Add Transaction"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
