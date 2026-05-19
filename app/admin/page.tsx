import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import AdminShell from "@/components/admin/AdminShell";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ROLE_PERMISSIONS } from "@/lib/adminAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import AdminDashboardClient from "./DashboardClient";

async function getLiveCounts() {
  const [inquiries, portfolio, blog, jobs, employees, projects, tasks] = await Promise.all([
    adminDb.collection("inquiries").count().get(),
    adminDb.collection("portfolio").where("status", "==", "Published").count().get(),
    adminDb.collection("blog").where("status", "==", "Published").count().get(),
    adminDb.collection("jobs").where("status", "==", "Open").count().get(),
    adminDb.collection("employees").where("status", "==", "Active").count().get(),
    adminDb.collection("projects").where("status", "==", "Active").count().get(),
    adminDb.collection("tasks").count().get(),
  ]);
  return {
    inquiries: inquiries.data().count,
    portfolio: portfolio.data().count,
    blog: blog.data().count,
    jobs: jobs.data().count,
    employees: employees.data().count,
    projects: projects.data().count,
    tasks: tasks.data().count,
  };
}

async function getRecentInquiries() {
  const snap = await adminDb.collection("inquiries").orderBy("createdAt", "desc").limit(5).get();
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name as string,
    email: d.data().email as string,
    service: d.data().service as string,
    status: d.data().status as string,
    date: d.data().createdAt?.toDate?.().toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "",
  }));
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const allowed = ROLE_PERMISSIONS[session.role];

  const [counts, recentInquiries] = await Promise.all([
    getLiveCounts(),
    getRecentInquiries(),
  ]);

  return (
    <AdminShell role={session.role} name={session.name}>
      <AdminDashboardClient
        session={session}
        allowed={allowed}
        counts={counts}
        recentInquiries={recentInquiries}
      />
    </AdminShell>
  );
}
