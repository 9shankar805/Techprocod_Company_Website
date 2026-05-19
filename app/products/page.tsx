import type { Metadata } from "next";
import { loadPageContentServer } from "@/lib/pageContentServer";
import { DEFAULT_SECTIONS } from "@/app/admin/page-builder/pageRegistry";
import { renderSection } from "@/app/admin/page-builder/renderSections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Software Products | POS, Hotel Management, Delivery System | Tech Procod",
  description:
    "Ready-made software products by Tech Procod: POS System, Hotel Management System, Delivery Management, School Management, and E-commerce Platform. Affordable, scalable solutions for Nepal.",
  keywords: [
    "POS system Nepal",
    "hotel management software",
    "delivery management system",
    "school management software",
    "e-commerce platform",
    "software products",
    "business software Nepal",
    "affordable software",
  ],
  openGraph: {
    title: "Software Products | Tech Procod",
    description: "Ready-made software solutions: POS, Hotel Management, Delivery, School Management, E-commerce",
    url: "https://techprocod.com/products",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/products",
  },
};

export default async function ProductsPage() {
  const raw = await loadPageContentServer("products");
  const sections = (raw ?? DEFAULT_SECTIONS["products"])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return <>{sections.map((s) => renderSection(s))}</>;
}
