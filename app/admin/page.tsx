import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import AdminShell from "@/components/admin/AdminShell";
import { MessageSquare, FolderOpen, FileText, Briefcase, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ROLE_PERMISSIONS } from "@/lib/adminAuth";

const stats = [
  { label: "Total Inquiries", value: "24", change: "+3 this week", icon: MessageSquare, color: "#2563eb", href: "/admin/inquiries" },
  { label: "Portfolio Items", value: "6",  change: "Last added: FoodRun", icon: FolderOpen,    color: "#7c3aed", href: "/admin/portfolio" },
  { label: "Blog Posts",      value: "6",  change: "Last: Dec 15",        icon: FileText,      color: "#059669", href: "/admin/blog" },
  { label: "Open Positions",  value: "4",  change: "2 internships",       icon: Briefcase,     color: "#d97706", href: "/admin/jobs" },
];

const recentInquiries = [
  { name: "Ramesh Sharma",  email: "ramesh@example.com", service: "Web Development", date: "Dec 15", status: "New" },
  { name: "Priya Thapa",    email: "priya@example.com",  service: "Mobile App",      date: "Dec 14", status: "Replied" },
  { name: "Bikash Yadav",   email: "bikash@example.com", service: "E-commerce",      date: "Dec 13", status: "New" },
  { name: "Sunita Jha",     email: "sunita@example.com", service: "UI/UX Design",    date: "Dec 12", status: "Closed" },
];

const statusColor: Record<string, string> = {
  New: "#2563eb", Replied: "#059669", Closed: "#9ca3af",
};

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const allowed = ROLE_PERMISSIONS[session.role];

  return (
    <AdminShell role={session.role} name={session.name}>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            Welcome back, <strong>{session.name}</strong>
          </p>
        </div>

        {/* Stats — only show cards the role can access */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {stats.filter((s) => allowed.includes(s.href)).map(({ label, value, change, icon: Icon, color, href }) => (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{label}</p>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={color} />
                  </div>
                </div>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{change}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Inquiries — only for superadmin & support */}
        {(session.role === "superadmin" || session.role === "support") && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Recent Inquiries</h2>
              <Link href="/admin/inquiries" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Name", "Email", "Service", "Date", "Status"].map((h) => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#111827" }}>{row.name}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{row.email}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{row.service}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{row.date}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: statusColor[row.status], background: statusColor[row.status] + "15", padding: "3px 10px", borderRadius: 100 }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "Add Portfolio Item", href: "/admin/portfolio", color: "#7c3aed" },
            { label: "Write Blog Post",    href: "/admin/blog",      color: "#059669" },
            { label: "Post Job Opening",   href: "/admin/jobs",      color: "#d97706" },
            { label: "View Inquiries",     href: "/admin/inquiries", color: "#2563eb" },
          ].filter((q) => allowed.includes(q.href)).map(({ label, href, color }) => (
            <Link key={label} href={href} style={{ display: "block", padding: "14px 16px", background: "white", border: "1px solid #e5e7eb", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, color }}>
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
