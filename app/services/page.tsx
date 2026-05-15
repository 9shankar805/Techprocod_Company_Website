import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ProcessSection from "@/components/services/ProcessSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Web Development, Mobile Apps & Digital Services Nepal | Tech Procod",
  description:
    "Tech Procod offers web development, mobile app development, e-commerce solutions, UI/UX design, AI integration, and custom software for businesses in Nepal. Get a free quote.",
  keywords: [
    "web development Nepal",
    "mobile app development Nepal",
    "e-commerce solutions Nepal",
    "UI/UX design Nepal",
    "AI integration Nepal",
    "custom software Nepal",
    "digital services Nepal",
    "website design Nepal",
    "app development Siraha",
    "software development Madhesh",
  ],
  openGraph: {
    title: "Digital Services & Web Development Nepal",
    description: "Web development, mobile apps, e-commerce, AI integration, and custom software",
    url: "https://techprocod.com/services",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ProcessSection />
      <CTASection />
    </>
  );
}
