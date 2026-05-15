import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import TeamSection from "@/components/about/TeamSection";
import Timeline from "@/components/about/Timeline";
import WhyChooseUs from "@/components/about/WhyChooseUs";

export const metadata: Metadata = {
  title: "About Tech Procod Pvt Ltd | Digital Solutions Company Nepal",
  description:
    "Learn about Tech Procod Pvt Ltd — Nepal's leading digital solutions company. Our mission, vision, team, and 5+ years of experience building web apps, mobile apps, and custom software.",
  keywords: [
    "about Tech Procod",
    "digital agency Nepal",
    "software company Siraha",
    "tech team Nepal",
    "company mission",
    "digital solutions provider",
  ],
  openGraph: {
    title: "About Tech Procod Pvt Ltd",
    description: "Nepal's leading digital solutions company with 50+ projects delivered",
    url: "https://techprocod.com/about",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <WhyChooseUs />
      <Timeline />
      <TeamSection />
    </>
  );
}
