import type { Metadata } from "next";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectsGrid from "@/components/portfolio/ProjectsGrid";
import CTASection from "@/components/home/CTASection";

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

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <ProjectsGrid />
      <CTASection />
    </>
  );
}
