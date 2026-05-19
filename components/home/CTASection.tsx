import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTAContent {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  whatsappUrl?: string;
}

const DEFAULTS: Required<CTAContent> = {
  heading: "Ready to Build Something?",
  subheading:
    "Tell us about your project and we'll get back to you with a free estimate within 24 hours.",
  primaryCtaLabel: "Get a Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Chat on WhatsApp",
  whatsappUrl: "https://wa.me/9779800000000",
};

interface CTASectionProps {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  whatsappUrl?: string;
}

export default function CTASection({
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  whatsappUrl,
}: CTASectionProps = {}) {
  const data: Required<CTAContent> = {
    heading: heading ?? DEFAULTS.heading,
    subheading: subheading ?? DEFAULTS.subheading,
    primaryCtaLabel: primaryCtaLabel ?? DEFAULTS.primaryCtaLabel,
    primaryCtaHref: primaryCtaHref ?? DEFAULTS.primaryCtaHref,
    secondaryCtaLabel: secondaryCtaLabel ?? DEFAULTS.secondaryCtaLabel,
    whatsappUrl: whatsappUrl ?? DEFAULTS.whatsappUrl,
  };

  return (
    <section style={{ background: "#0f172a", padding: "80px 0", position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 300, height: 300, background: "rgba(37, 99, 235, 0.05)", borderRadius: "50%", filter: "blur(60px)" }} />

      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          {data.heading}
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "#94a3b8",
            marginBottom: 48,
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.6,
          }}
        >
          {data.subheading}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={data.primaryCtaHref}
            className="btn-primary"
            style={{
              padding: "14px 36px",
              fontSize: 16,
            }}
          >
            {data.primaryCtaLabel} <ArrowRight size={18} />
          </Link>
          <a
            href={data.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{
              color: "white",
              borderColor: "rgba(255,255,255,0.2)",
              padding: "14px 36px",
              fontSize: 16,
            }}
          >
            {data.secondaryCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
