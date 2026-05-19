export type Role = "superadmin" | "editor" | "support";

export interface AdminUser {
  username: string;
  password: string;
  role: Role;
  name: string;
}

// All admin users — in production move to a database
export const ADMIN_USERS: AdminUser[] = [
  {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "techprocod@2024",
    role: "superadmin",
    name: "Super Admin",
  },
  {
    username: process.env.EDITOR_USERNAME || "editor",
    password: process.env.EDITOR_PASSWORD || "editor@2024",
    role: "editor",
    name: "Content Editor",
  },
  {
    username: process.env.SUPPORT_USERNAME || "support",
    password: process.env.SUPPORT_PASSWORD || "support@2024",
    role: "support",
    name: "Support Staff",
  },
];

export const SESSION_KEY = "tp_admin_session";

// What each role can access
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  superadmin: ["/admin", "/admin/inquiries", "/admin/portfolio", "/admin/blog", "/admin/jobs", "/admin/applications", "/admin/users", "/admin/employees", "/admin/leaves", "/admin/attendance", "/admin/projects", "/admin/tasks", "/admin/finance", "/admin/announcements", "/admin/settings", "/admin/messages", "/admin/hr/payroll", "/admin/hr/performance", "/admin/hr/orgchart", "/admin/clients", "/admin/audit", "/admin/testimonials", "/admin/page-builder"],
  editor:     ["/admin", "/admin/portfolio", "/admin/blog", "/admin/tasks", "/admin/announcements", "/admin/messages", "/admin/testimonials", "/admin/page-builder"],
  support:    ["/admin", "/admin/inquiries", "/admin/applications", "/admin/employees", "/admin/leaves", "/admin/attendance", "/admin/announcements", "/admin/messages", "/admin/hr/orgchart", "/admin/clients"],
};

export function canAccess(role: Role, path: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.some((p) => path === p || path.startsWith(p + "/"));
}

export const ROLE_LABELS: Record<Role, { label: string; color: string; bg: string }> = {
  superadmin: { label: "Super Admin", color: "#7c3aed", bg: "#faf5ff" },
  editor:     { label: "Editor",      color: "#059669", bg: "#f0fdf4" },
  support:    { label: "Support",     color: "#2563eb", bg: "#eff6ff" },
};
