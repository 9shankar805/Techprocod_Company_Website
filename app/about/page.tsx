import type { Metadata } from "next";
import { loadPageContentServer } from "@/lib/pageContentServer";
import { DEFAULT_SECTIONS } from "@/app/admin/page-builder/pageRegistry";
import { renderSection } from "@/app/admin/page-builder/renderSections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Tech Procod Pvt Ltd — Digital Solutions Nepal",
  description:
    "Learn about Tech Procod Pvt Ltd — our mission, vision, team, and journey building digital solutions for Nepal since 2022.",
  alternates: { canonical: "https://techprocod.com/about" },
};

export default async function AboutPage() {
  const raw = await loadPageContentServer("about");
  const sections = (raw ?? DEFAULT_SECTIONS["about"])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return <>{sections.map((s) => renderSection(s))}</>;
}
