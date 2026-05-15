import type { Metadata } from "next";
import CareersHero from "@/components/careers/CareersHero";
import JobListings from "@/components/careers/JobListings";
import CTASection from "@/components/home/CTASection";

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

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <JobListings />
      <CTASection />
    </>
  );
}
