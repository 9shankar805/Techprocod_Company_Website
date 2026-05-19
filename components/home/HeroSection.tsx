import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
}

interface HeroContent {
  badge?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  stats?: StatItem[];
}

const DEFAULTS: Required<HeroContent> = {
  badge: "Nepal's Digital Solutions Partner",
  heading: "Building Smart Digital Solutions for Nepal",
  subheading:
    "We design and build web apps, mobile apps, e-commerce platforms, and custom software that help Nepali businesses grow in the digital age.",
  primaryCtaLabel: "Start Your Project",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "View Our Work",
  secondaryCtaHref: "/portfolio",
  image: "/assets/logo.jpg",
  stats: [
    { value: "50+", label: "Projects Delivered" },
    { value: "30+", label: "Happy Clients" },
    { value: "5+", label: "Years Experience" },
    { value: "100%", label: "Client Satisfaction" },
  ],
};

interface HeroSectionProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  stats?: StatItem[];
}

export default function HeroSection({
  badge,
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  image,
  stats,
}: HeroSectionProps = {}) {
  const data: Required<HeroContent> = {
    badge: badge ?? DEFAULTS.badge,
    heading: heading ?? DEFAULTS.heading,
    subheading: subheading ?? DEFAULTS.subheading,
    primaryCtaLabel: primaryCtaLabel ?? DEFAULTS.primaryCtaLabel,
    primaryCtaHref: primaryCtaHref ?? DEFAULTS.primaryCtaHref,
    secondaryCtaLabel: secondaryCtaLabel ?? DEFAULTS.secondaryCtaLabel,
    secondaryCtaHref: secondaryCtaHref ?? DEFAULTS.secondaryCtaHref,
    image: image ?? DEFAULTS.image,
    stats: Array.isArray(stats) && stats.length > 0 ? stats : DEFAULTS.stats,
  };

  return (
    <section style={{ paddingTop: 100, paddingBottom: 100, borderBottom: "1px solid #f1f5f9", background: "white" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <span className="badge" style={{ marginBottom: 20 }}>{data.badge}</span>
            <h1
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                marginBottom: 24,
              }}
            >
              {data.heading}
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 540,
              }}
            >
              {data.subheading}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
              <Link href={data.primaryCtaHref} className="btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
                {data.primaryCtaLabel} <ArrowRight size={18} />
              </Link>
              <Link href={data.secondaryCtaHref} className="btn-outline" style={{ padding: "14px 32px", fontSize: 16 }}>
                {data.secondaryCtaLabel}
              </Link>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {data.stats.map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ 
              position: "absolute", 
              inset: "-20px", 
              background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)", 
              borderRadius: 32, 
              zIndex: 0,
              transform: "rotate(-2deg)"
            }} />
            <img 
              src={data.image} 
              alt="Hero" 
              style={{ 
                width: "100%", 
                height: "auto", 
                maxHeight: 480,
                objectFit: "contain",
                borderRadius: 24, 
                position: "relative",
                zIndex: 1,
                display: "block"
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
