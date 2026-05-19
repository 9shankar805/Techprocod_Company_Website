import type { Metadata } from "next";
import { loadPageContentServer } from "@/lib/pageContentServer";
import { DEFAULT_SECTIONS } from "@/app/admin/page-builder/pageRegistry";
import { renderSection } from "@/app/admin/page-builder/renderSections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Web Apps, Mobile Apps & Projects | Tech Procod Nepal",
  description:
    "Explore Tech Procod's portfolio of 50+ successful projects including StyleAura, RideSewa, HotelSewa, and Siraha Bazaar. Web apps, mobile apps, and e-commerce solutions built for Nepal.",
  keywords: [
    "portfolio",
    "projects Nepal",
    "web app examples",
    "mobile app portfolio",
    "e-commerce projects",
    "case studies",
    "StyleAura",
    "RideSewa",
    "HotelSewa",
    "Siraha Bazaar",
  ],
  openGraph: {
    title: "Portfolio | Tech Procod Projects",
    description: "50+ successful projects including web apps, mobile apps, and e-commerce solutions",
    url: "https://techprocod.com/portfolio",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/portfolio",
  },
};

export default async function PortfolioPage() {
  const raw = await loadPageContentServer("portfolio");
  const sections = (raw ?? DEFAULT_SECTIONS["portfolio"])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return <>{sections.map((s) => renderSection(s))}</>;
}
