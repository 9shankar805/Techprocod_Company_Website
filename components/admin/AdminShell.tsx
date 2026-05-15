"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2, LayoutDashboard, FolderOpen, FileText,
  MessageSquare, Briefcase, LogOut, Menu, ChevronRight, Users,
} from "lucide-react";
import { ROLE_LABELS, ROLE_PERMISSIONS, type Role } from "@/lib/adminAuth";

const ALL_NAV = [
  { label: "Dashboard",   href: "/admin",             icon: LayoutDashboard },
  { label: "Inquiries",   href: "/admin/inquiries",   icon: MessageSquare },
  { label: "Portfolio",   href: "/admin/portfolio",   icon: FolderOpen },
  { label: "Blog Posts",  href: "/admin/blog",        icon: FileText },
  { label: "Job Listings",href: "/admin/jobs",        icon: Briefcase },
  { label: "Users",       href: "/admin/users",       icon: Users },
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
  const navItems = ALL_NAV.filter((n) =>
    allowed.some((p) => n.href === p || n.href.startsWith(p + "/"))
  );

  const roleInfo = ROLE_LABELS[role];

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const Sidebar = () => (
    <aside style={{ width: 240, background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #e5e7eb" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Code2 size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1 }}>TechProcod</p>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: roleInfo.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: roleInfo.color, flexShrink: 0 }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: roleInfo.color, background: roleInfo.bg, padding: "1px 7px", borderRadius: 100 }}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: active ? 600 : 400, background: active ? "#eff6ff" : "transparent", color: active ? "#2563eb" : "#374151" }}>
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, textDecoration: "none", fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
          View Website ↗
        </Link>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, fontSize: 14, color: "#ef4444", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8f9fa", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop"><Sidebar /></div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 1, width: 240 }}><Sidebar /></div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(true)} className="admin-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 4 }}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: roleInfo.color, background: roleInfo.bg, padding: "3px 10px", borderRadius: 100 }}>
              {roleInfo.label}
            </span>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{name}</span>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</main>
      </div>

      <style>{`
        .admin-sidebar-desktop { display: flex; }
        .admin-menu-btn { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
