import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import AdminShell from "@/components/admin/AdminShell";
import PageBuilderClient from "./PageBuilderClient";

export default async function PageBuilderPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  if (session.role !== "superadmin" && session.role !== "editor") {
    redirect("/admin/unauthorized");
  }

  return (
    <AdminShell role={session.role} name={session.name}>
      <PageBuilderClient />
    </AdminShell>
  );
}
