"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2, LayoutDashboard, FolderOpen, FileText, MessageSquare,
  Briefcase, LogOut, Menu, ChevronRight, Users, UserCheck,
  CalendarClock, ClipboardList, FolderKanban, CheckSquare,
  DollarSign, Bell, Settings, X, GitBranch, Star, MessagesSquare,
  UserCircle, Activity, FileSearch, LayoutTemplate,
} from "lucide-react";
import { ROLE_LABELS, ROLE_PERMISSIONS, type Role } from "@/lib/adminAuth";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",      href: "/admin",               icon: LayoutDashboard },
      { label: "Announcements",  href: "/admin/announcements", icon: Bell },
    ],
  },
  {
    label: "Client Work",
    items: [
      { label: "Projects",       href: "/admin/projects",      icon: FolderKanban },
      { label: "Tasks",          href: "/admin/tasks",         icon: CheckSquare },
      { label: "Clients",        href: "/admin/clients",       icon: UserCircle },
      { label: "Inquiries",      href: "/admin/inquiries",     icon: MessageSquare },
      { label: "Portfolio",      href: "/admin/portfolio",     icon: FolderOpen },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Page Builder",   href: "/admin/page-builder",  icon: LayoutTemplate },
      { label: "Blog Posts",     href: "/admin/blog",          icon: FileText },
      { label: "Job Listings",   href: "/admin/jobs",          icon: Briefcase },
      { label: "Applications",   href: "/admin/applications",  icon: FileSearch },
      { label: "Testimonials",   href: "/admin/testimonials",  icon: Star },
    ],
  },
  {
    label: "HR & People",
    items: [
      { label: "Employees",      href: "/admin/employees",         icon: UserCheck },
      { label: "Leave Requests", href: "/admin/leaves",            icon: CalendarClock },
      { label: "Attendance",     href: "/admin/attendance",        icon: ClipboardList },
      { label: "Payroll",        href: "/admin/hr/payroll",        icon: DollarSign },
      { label: "Performance",    href: "/admin/hr/performance",    icon: Star },
      { label: "Org Chart",      href: "/admin/hr/orgchart",       icon: GitBranch },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Finance",        href: "/admin/finance",           icon: DollarSign },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Team Messages",  href: "/admin/messages",          icon: MessagesSquare },
      { label: "Audit Log",      href: "/admin/audit",             icon: Activity },
      { label: "Users",          href: "/admin/users",             icon: Users },
      { label: "Settings",       href: "/admin/settings",          icon: Settings },
    ],
  },
];

interface Props {
  children: React.ReactNode;
  role: Role;
  name: string;
}

export default function AdminShell({ children, role, name }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allowed = ROLE_PERMISSIONS[role] || [];

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const roleInfo = ROLE_LABELS[role];

  const Sidebar = () => (
    <aside style={{ width: 240, background: "#0f172a", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0, overflowY: "auto" }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img 
            src="/assets/icon.jpg" 
            alt="TP" 
            style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} 
          />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1 }}>TechProcod</p>
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Admin Panel</p>
          </div>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="admin-menu-close" style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 2 }}>
          <X size={16} />
        </button>
      </div>

      {/* User info */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1e293b", border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
          <span style={{ fontSize: 10, fontWeight: 600, color: roleInfo.color, background: roleInfo.bg, padding: "1px 7px", borderRadius: 100 }}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Grouped Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 0 }}>
        {NAV_GROUPS.map(group => {
          const visibleItems = group.items.filter(item =>
            allowed.some(p => item.href === p || item.href.startsWith(p + "/"))
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 10px 4px" }}>{group.label}</p>
              {visibleItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 7, textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? "#1e40af" : "transparent", color: active ? "white" : "#94a3b8", marginBottom: 1 }}>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    {label}
                    {active && <ChevronRight size={13} style={{ marginLeft: "auto", color: "#93c5fd" }} />}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "10px", borderTop: "1px solid #1e293b" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, textDecoration: "none", fontSize: 12, color: "#64748b", marginBottom: 2 }}>
          View Website ↗
        </Link>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, fontSize: 13, color: "#f87171", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop"><Sidebar /></div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 1, width: 240 }}><Sidebar /></div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar — mobile only */}
        <header style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(true)} className="admin-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 4 }}>
            <Menu size={20} />
          </button>
          {/* Breadcrumb */}
          <div className="admin-breadcrumb" style={{ fontSize: 13, color: "#64748b" }}>
            {NAV_GROUPS.flatMap(g => g.items).find(i => i.href === pathname)?.label || "Admin"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: roleInfo.color, background: roleInfo.bg, padding: "3px 10px", borderRadius: 100 }}>{roleInfo.label}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{name}</span>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: pathname === "/admin/page-builder" ? "hidden" : "auto", padding: pathname === "/admin/page-builder" ? 0 : 24, display: "flex", flexDirection: "column" }}>{children}</main>
      </div>

      <style>{`
        .admin-sidebar-desktop { display: flex; }
        .admin-menu-btn { display: none; }
        .admin-menu-close { display: none; }
        .admin-breadcrumb { display: block; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-menu-btn { display: block !important; }
          .admin-menu-close { display: block !important; }
        }
      `}</style>
    </div>
  );
}
