import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section style={{ background: "#2563eb", padding: "72px 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: 16 }}>
          Ready to Build Something?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          Tell us about your project and we&apos;ll get back to you with a free estimate within 24 hours.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              color: "#2563eb",
              padding: "12px 28px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Get a Free Quote <ArrowRight size={16} />
          </Link>
          <a
            href="https://wa.me/9779800000000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "white",
              padding: "12px 28px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
