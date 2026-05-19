"use client";
import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Plus, X, Save, Star, Trash2, Search } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

type Review = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  reviewPeriod: string;
  rating: number;
  productivity: number;
  teamwork: number;
  communication: number;
  punctuality: number;
  strengths: string;
  improvements: string;
  goals: string;
  reviewedBy: string;
  createdAt: string;
};

const EMPTY: Omit<Review, "id" | "createdAt"> = {
  employeeName: "", employeeId: "", department: "Engineering",
  reviewPeriod: new Date().toISOString().slice(0, 7),
  rating: 3, productivity: 3, teamwork: 3, communication: 3, punctuality: 3,
  strengths: "", improvements: "", goals: "", reviewedBy: "",
};

const ratingLabel = (r: number) => ["", "Poor", "Below Average", "Average", "Good", "Excellent"][r] ?? "";
const ratingColor = (r: number) => ["", "#ef4444", "#f97316", "#d97706", "#059669", "#2563eb"][r] ?? "#6b7280";

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16} fill={i <= value ? ratingColor(value) : "none"} color={i <= value ? ratingColor(value) : "#d1d5db"}
          style={{ cursor: onChange ? "pointer" : "default" }}
          onClick={() => onChange?.(i)} />
      ))}
    </div>
  );
}

export default function PerformancePage() {
  const { role, name } = useAdminSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Omit<Review, "id" | "createdAt">>(EMPTY);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/performance").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setReviews(d);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, reviewedBy: name }); setModal(true); };
  const openEdit = (r: Review) => { setEditing(r); setForm({ ...r }); setModal(true); };

  const save = async () => {
    if (!form.employeeName.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch("/api/admin/performance", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
      setReviews(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      const res = await fetch("/api/admin/performance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const { id } = await res.json();
      setReviews(prev => [{ id, ...form, createdAt: new Date().toISOString() }, ...prev]);
    }
    setSaving(false); setModal(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/performance", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    return r.employeeName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  });

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>{children}</div>
  );

  const RatingField = ({ label, field }: { label: string; field: keyof typeof form }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Stars value={form[field] as number} onChange={v => setForm({ ...form, [field]: v })} />
        <span style={{ fontSize: 12, color: ratingColor(form[field] as number), fontWeight: 600, minWidth: 90 }}>{ratingLabel(form[field] as number)}</span>
      </div>
    </div>
  );

  return (
    <AdminShell role={role} name={name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Performance Reviews</h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{reviews.length} reviews · Avg rating: {avgRating}/5</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}>
            <Plus size={15} /> Add Review
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
          {[5, 4, 3, 2, 1].map(r => (
            <div key={r} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Star size={13} fill={ratingColor(r)} color={ratingColor(r)} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{ratingLabel(r)}</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: ratingColor(r) }}>{reviews.filter(rv => rv.rating === r).length}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input placeholder="Search employee or department..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: "100%" }} />
        </div>

        {/* Cards */}
        {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
          {!loading && filtered.map(r => (
            <div key={r.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{r.employeeName}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{r.department} · {r.reviewPeriod}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(r)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#374151", fontSize: 11 }}>Edit</button>
                  <button onClick={() => remove(r.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "10px 14px", background: ratingColor(r.rating) + "10", borderRadius: 8 }}>
                <Stars value={r.rating} />
                <span style={{ fontSize: 14, fontWeight: 700, color: ratingColor(r.rating) }}>{ratingLabel(r.rating)}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[
                  ["Productivity", r.productivity],
                  ["Teamwork", r.teamwork],
                  ["Communication", r.communication],
                  ["Punctuality", r.punctuality],
                ].map(([label, val]) => (
                  <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 90 }}>{label}</span>
                    <Stars value={val as number} />
                  </div>
                ))}
              </div>
              {r.strengths && <p style={{ fontSize: 12, color: "#059669", marginBottom: 4 }}>✓ {r.strengths}</p>}
              {r.improvements && <p style={{ fontSize: 12, color: "#d97706" }}>↑ {r.improvements}</p>}
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Reviewed by {r.reviewedBy}</p>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12 }}>No reviews found</div>
          )}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editing ? "Edit Review" : "Add Performance Review"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="Employee Name *"><input placeholder="Full name" value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} /></F>
                <F label="Employee ID"><input placeholder="EMP-001" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} /></F>
                <F label="Department">
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {["Engineering","Design","Marketing","Sales","Support","HR","Finance","Operations"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </F>
                <F label="Review Period"><input type="month" value={form.reviewPeriod} onChange={e => setForm({ ...form, reviewPeriod: e.target.value })} /></F>
              </div>

              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "4px 16px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", padding: "10px 0 4px" }}>Performance Ratings</p>
                <RatingField label="Overall Rating" field="rating" />
                <RatingField label="Productivity" field="productivity" />
                <RatingField label="Teamwork" field="teamwork" />
                <RatingField label="Communication" field="communication" />
                <RatingField label="Punctuality" field="punctuality" />
              </div>

              <F label="Strengths"><textarea rows={2} placeholder="Key strengths observed..." value={form.strengths} onChange={e => setForm({ ...form, strengths: e.target.value })} style={{ resize: "vertical" }} /></F>
              <F label="Areas for Improvement"><textarea rows={2} placeholder="Areas to work on..." value={form.improvements} onChange={e => setForm({ ...form, improvements: e.target.value })} style={{ resize: "vertical" }} /></F>
              <F label="Goals for Next Period"><textarea rows={2} placeholder="Goals and targets..." value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} style={{ resize: "vertical" }} /></F>
              <F label="Reviewed By"><input placeholder="Reviewer name" value={form.reviewedBy} onChange={e => setForm({ ...form, reviewedBy: e.target.value })} /></F>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Save size={14} /> {saving ? "Saving..." : editing ? "Update" : "Save Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
