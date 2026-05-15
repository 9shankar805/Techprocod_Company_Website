import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You | Tech Procod Pvt Ltd",
  description: "Thank you for contacting Tech Procod. We'll be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8f9fa" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#f0fdf4",
              border: "2px solid #bbf7d0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckCircle size={36} color="#16a34a" />
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Message Received!
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#6b7280",
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Thank you for reaching out to Tech Procod. We&apos;ve received your message and will get back to you within 24 hours.
          </p>

          {/* What happens next */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 28,
              textAlign: "left",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 20,
              }}
            >
              What happens next?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  step: "1",
                  title: "We review your message",
                  desc: "Our team reviews your inquiry and assigns the right specialist.",
                },
                {
                  step: "2",
                  title: "We reach out within 24 hours",
                  desc: "Expect a call or email from us to discuss your project in detail.",
                },
                {
                  step: "3",
                  title: "Free consultation",
                  desc: "We schedule a free 30-minute consultation to understand your needs.",
                },
                {
                  step: "4",
                  title: "Proposal & quote",
                  desc: "We send you a detailed proposal with timeline and pricing.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: "flex", gap: 14 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#eff6ff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    {step}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{title}</p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/portfolio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#2563eb",
                color: "white",
                padding: "11px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View Our Work <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "white",
                color: "#374151",
                padding: "11px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #e5e7eb",
              }}
            >
              Explore Services
            </Link>
          </div>

          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 28 }}>
            Need urgent help?{" "}
            <a href="https://wa.me/9779800000000" style={{ color: "#2563eb", textDecoration: "none" }}>
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
