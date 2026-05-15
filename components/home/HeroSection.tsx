import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, borderBottom: "1px solid #e5e7eb" }}>
      <div className="container">
        <div style={{ maxWidth: 680 }}>
          <span className="badge">Nepal&apos;s Digital Solutions Partner</span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#111827", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20 }}>
            Building Smart Digital Solutions for Nepal
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>
            We design and build web apps, mobile apps, e-commerce platforms, and custom software
            that help Nepali businesses grow in the digital age.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">
              Start Your Project <ArrowRight size={16} />
            </Link>
            <Link href="/portfolio" className="btn-outline">
              View Our Work
            </Link>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", gap: 32, marginTop: 52, flexWrap: "wrap" }}>
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "30+", label: "Happy Clients" },
              { value: "5+", label: "Years Experience" },
              { value: "100%", label: "Client Satisfaction" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
