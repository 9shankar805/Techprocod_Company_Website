import type { Metadata } from "next";
import { loadPageContentServer } from "@/lib/pageContentServer";
import { DEFAULT_SECTIONS } from "@/app/admin/page-builder/pageRegistry";
import { renderSection } from "@/app/admin/page-builder/renderSections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers | Join Tech Procod | Jobs in Nepal",
  description:
    "Join Tech Procod Pvt Ltd! We're hiring web developers, mobile developers, UI/UX designers, and digital marketers. Internship opportunities available. Build the future with us.",
  keywords: [
    "jobs Nepal",
    "web developer jobs",
    "mobile developer jobs",
    "UI/UX designer jobs",
    "internship Nepal",
    "tech careers",
    "Siraha jobs",
    "remote jobs Nepal",
  ],
  openGraph: {
    title: "Careers | Tech Procod",
    description: "Join our team. We're hiring developers, designers, and digital strategists.",
    url: "https://techprocod.com/careers",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/careers",
  },
};

export default async function CareersPage() {
  const raw = await loadPageContentServer("careers");
  const sections = (raw ?? DEFAULT_SECTIONS["careers"])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return <>{sections.map((s) => renderSection(s))}</>;
}
