"use client";
import { useEffect, useState, useCallback } from "react";
import { MessageSquare, FolderOpen, FileText, Briefcase, ArrowUpRight, Bell, Plus, UserCheck, FolderKanban, CheckSquare, DollarSign, TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Role } from "@/lib/adminAuth";

type Session = { username: string; role: Role; name: string };
type Counts = { inquiries: number; portfolio: number; blog: number; jobs: number; employees: number; projects: number; tasks: number };
type Inquiry = { id: string; name: string; email: string; service: string; status: string; date: string };
type AuditEntry = { id: string; actor: string; action: string; entity: string; detail: string; timestamp: string };

const statusColor: Record<string, string> = { New: "#2563eb", Replied: "#059669", Closed: "#9ca3af" };
const actionColor: Record<string, string> = { created: "#059669", updated: "#2563eb", deleted: "#ef4444", approved: "#059669", rejected: "#ef4444", login: "#7c3aed" };
const actionIcon: Record<string, string> = { created: "✚", updated: "✎", deleted: "✕", approved: "✓", rejected: "✗", login: "→" };

// Skeleton loader
const Skeleton = ({ w = "100%", h = 20 }: { w?: string | number; h?: number }) => (
  <div style={{ width: w, height: h, background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", borderRadius: 6, animation: "shimmer 1.5s infinite" }} />
);

export default function AdminDashboardClient({
  session, allowed, counts, recentInquiries,
}: {
  session: Session; allowed: string[];
  counts: Counts; recentInquiries: Inquiry[];
}) {
  const [activeSessions, setActiveSessions] = useState(0);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [financeData, setFinanceData] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [taskStats, setTaskStats] = useState<{ name: string; value: number; color: string }[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([]);

  useEffect(() => {
    // Live chat sessions
    let sessRef: any = null;
    let handler: any = null;

    if (rtdb) {
      sessRef = ref(rtdb, "chatSessions");
      handler = onValue(sessRef, snap => {
        const count = snap.exists() ? Object.keys(snap.val()).length : 0;
        setActiveSessions(count);
        if (count > 0) {
          setNotifications(prev => {
            const exists = prev.find(n => n.id === "chat");
            if (exists) return prev;
            return [{ id: "chat", text: `${count} active chat session${count > 1 ? "s" : ""}`, time: "now", read: false }, ...prev];
          });
        }
      });
    }

    // Audit log
    fetch("/api/admin/audit").then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setAuditLog(d.slice(0, 15));
        // Build notifications from recent audit
        const notifs = d.slice(0, 5).map((a: AuditEntry) => ({
          id: a.id, text: `${a.actor} ${a.action} ${a.entity}: ${a.detail}`,
          time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
          read: false,
        }));
        setNotifications(prev => [...prev.filter(n => n.id === "chat"), ...notifs]);
      }
      setAuditLoading(false);
    }).catch(() => setAuditLoading(false));

    // Finance chart data (last 6 months mock from transactions)
    fetch("/api/admin/finance").then(r => r.json()).then(d => {
      if (!Array.isArray(d)) return;
      const months: Record<string, { income: number; expense: number }> = {};
      d.forEach((t: { date: string; type: string; amount: string }) => {
        const m = t.date?.slice(0, 7);
        if (!m) return;
        if (!months[m]) months[m] = { income: 0, expense: 0 };
        if (t.type === "Income") months[m].income += Number(t.amount);
        else months[m].expense += Number(t.amount);
      });
      const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
      setFinanceData(sorted.map(([month, v]) => ({ month: month.slice(5), ...v })));
    }).catch(() => {});

    // Task stats
    fetch("/api/admin/tasks").then(r => r.json()).then(d => {
      if (!Array.isArray(d)) return;
      const counts = { Todo: 0, "In Progress": 0, Review: 0, Done: 0 };
      d.forEach((t: { status: string }) => { if (t.status in counts) counts[t.status as keyof typeof counts]++; });
      setTaskStats([
        { name: "Todo", value: counts.Todo, color: "#94a3b8" },
        { name: "In Progress", value: counts["In Progress"], color: "#2563eb" },
        { name: "Review", value: counts.Review, color: "#7c3aed" },
        { name: "Done", value: counts.Done, color: "#059669" },
      ]);
    }).catch(() => {});

    return () => {
      if (sessRef && handler) off(sessRef, "value", handler);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const statCards = [
    { label: "Inquiries",  value: counts.inquiries, icon: MessageSquare, color: "#2563eb", href: "/admin/inquiries" },
    { label: "Projects",   value: counts.projects,  icon: FolderKanban,  color: "#7c3aed", href: "/admin/projects" },
    { label: "Tasks",      value: counts.tasks,     icon: CheckSquare,   color: "#d97706", href: "/admin/tasks" },
    { label: "Employees",  value: counts.employees, icon: UserCheck,     color: "#059669", href: "/admin/employees" },
    { label: "Portfolio",  value: counts.portfolio, icon: FolderOpen,    color: "#0891b2", href: "/admin/portfolio" },
    { label: "Blog Posts", value: counts.blog,      icon: FileText,      color: "#059669", href: "/admin/blog" },
    { label: "Jobs Open",  value: counts.jobs,      icon: Briefcase,     color: "#d97706", href: "/admin/jobs" },
  ].filter(s => allowed.some(p => s.href === p || s.href.startsWith(p + "/")));

  const quickActions = [
    { label: "New Project",   href: "/admin/projects",   icon: FolderKanban, color: "#7c3aed" },
    { label: "Add Task",      href: "/admin/tasks",      icon: CheckSquare,  color: "#2563eb" },
    { label: "Hire Employee", href: "/admin/employees",  icon: UserCheck,    color: "#059669" },
    { label: "Add Income",    href: "/admin/finance",    icon: DollarSign,   color: "#d97706" },
    { label: "New Blog Post", href: "/admin/blog",       icon: FileText,     color: "#0891b2" },
    { label: "Post Job",      href: "/admin/jobs",       icon: Briefcase,    color: "#ea580c" },
  ].filter(a => allowed.some(p => a.href === p || a.href.startsWith(p + "/")));

  return (
    <div style={{ maxWidth: 1300 }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>Welcome back, <strong>{session.name}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {activeSessions > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#2563eb", fontWeight: 500 }}>
              <Activity size={13} /> {activeSessions} live chat{activeSessions > 1 ? "s" : ""}
            </div>
          )}
          {/* Notification Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => { setNotifOpen(o => !o); markAllRead(); }} style={{ position: "relative", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Bell size={16} color="#374151" />
              {unreadCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div style={{ position: "absolute", right: 0, top: 44, width: 320, background: "white", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Notifications</span>
                  <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af" }}>×</button>
                </div>
                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {notifications.length === 0 && <p style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No notifications</p>}
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f9fafb", background: n.read ? "white" : "#f8faff" }}>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{n.text}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "box-shadow 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#6b7280" }}>{label}</p>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={color} />
                </div>
              </div>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>{value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Revenue Trend</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Last 6 months</p>
            </div>
            <TrendingUp size={16} color="#059669" />
          </div>
          {financeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={financeData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${(Number(v)/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => `NPR ${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="income" stroke="#059669" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#d1d5db" }}>No finance data yet</p>
            </div>
          )}
        </div>

        {/* Task Completion Bar Chart */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Task Status</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Current breakdown</p>
            </div>
            <CheckSquare size={16} color="#2563eb" />
          </div>
          {taskStats.some(t => t.value > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={taskStats} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {taskStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#d1d5db" }}>No tasks yet</p>
            </div>
          )}
        </div>

        {/* Task Pie */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Completion Rate</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>Tasks done vs total</p>
          {taskStats.some(t => t.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={taskStats} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                    {taskStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {taskStats.map(t => (
                  <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                    {t.name} ({t.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#d1d5db" }}>No data</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Zap size={15} color="#d97706" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Quick Actions</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: color + "10", border: `1px solid ${color}30`, borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500, color }}>
              <Icon size={14} /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Row: Recent Inquiries + Activity Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        {/* Recent Inquiries */}
        {(session.role === "superadmin" || session.role === "support") && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Recent Inquiries</p>
              <Link href="/admin/inquiries" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowUpRight size={12} /></Link>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Name", "Service", "Date", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInquiries.length === 0 && <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No inquiries yet</td></tr>}
                {recentInquiries.map(row => (
                  <tr key={row.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{row.name}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>{row.email}</p>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>{row.service}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af" }}>{row.date}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[row.status] ?? "#374151", background: (statusColor[row.status] ?? "#374151") + "15", padding: "2px 8px", borderRadius: 100 }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Activity Feed / Audit Log */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Activity Feed</p>
            <Activity size={14} color="#9ca3af" />
          </div>
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {auditLoading && (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <Skeleton w={28} h={28} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <Skeleton h={12} />
                      <Skeleton w="60%" h={10} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!auditLoading && auditLog.length === 0 && (
              <p style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No activity yet</p>
            )}
            {!auditLoading && auditLog.map(entry => (
              <div key={entry.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f9fafb", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: (actionColor[entry.action] ?? "#6b7280") + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: actionColor[entry.action] ?? "#6b7280", flexShrink: 0, fontWeight: 700 }}>
                  {actionIcon[entry.action] ?? "•"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>
                    <strong>{entry.actor}</strong> {entry.action} <span style={{ color: "#6b7280" }}>{entry.entity}</span>
                  </p>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.detail}</p>
                  <p style={{ fontSize: 10, color: "#d1d5db", marginTop: 2 }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
