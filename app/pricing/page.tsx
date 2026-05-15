import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Tech Procod Pvt Ltd — Affordable Digital Solutions Nepal",
  description: "Transparent pricing for web development, mobile apps, e-commerce, SEO, and hosting services in Nepal. Starting from NPR 15,000.",
  alternates: { canonical: "https://techprocod.com/pricing" },
};

const services = [
  {
    name: "Website Development",
    tiers: [
      { name: "Basic", price: "NPR 30,000", desc: "5-page business website", features: ["Responsive design", "Contact form", "SEO basics", "1 month support"] },
      { name: "Professional", price: "NPR 60,000", desc: "Full business website", features: ["Up to 15 pages", "CMS integration", "Advanced SEO", "3 months support", "Analytics setup"], highlight: true },
      { name: "Enterprise", price: "Custom", desc: "Complex web application", features: ["Unlimited pages", "Custom features", "API integrations", "6 months support", "Priority support"] },
    ],
  },
  {
    name: "Mobile App Development",
    tiers: [
      { name: "Basic", price: "NPR 2,00,000", desc: "Simple mobile app", features: ["Android + iOS", "Up to 10 screens", "Basic backend", "1 month support"] },
      { name: "Professional", price: "NPR 5,00,000", desc: "Feature-rich app", features: ["Android + iOS", "Unlimited screens", "Full backend", "Payment integration", "3 months support"], highlight: true },
      { name: "Enterprise", price: "Custom", desc: "Complex platform", features: ["All Professional features", "Real-time features", "AI integration", "6 months support", "Dedicated team"] },
    ],
  },
  {
    name: "E-commerce Store",
    tiers: [
      { name: "Starter", price: "NPR 60,000", desc: "Basic online store", features: ["Up to 100 products", "eSewa + Khalti", "Order management", "1 month support"] },
      { name: "Growth", price: "NPR 1,20,000", desc: "Full e-commerce platform", features: ["Unlimited products", "Multi-payment", "Inventory system", "Analytics", "3 months support"], highlight: true },
      { name: "Marketplace", price: "Custom", desc: "Multi-vendor marketplace", features: ["Multi-vendor", "Commission system", "Seller dashboard", "6 months support", "Custom features"] },
    ],
  },
];

const monthly = [
  { name: "SEO & Marketing", starter: "NPR 10,000/mo", pro: "NPR 20,000/mo", features: ["Keyword research", "On-page SEO", "Monthly report", "Google Analytics"] },
  { name: "Hosting (VPS)", starter: "NPR 3,000/mo", pro: "NPR 6,000/mo", features: ["99.9% uptime", "SSL certificate", "Daily backups", "24/7 monitoring"] },
  { name: "Maintenance", starter: "NPR 5,000/mo", pro: "NPR 10,000/mo", features: ["Bug fixes", "Security updates", "Performance monitoring", "Monthly report"] },
];

export default function PricingPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "56px 0 48px", textAlign: "center" }}>
        <div className="container">
          <span className="badge">Pricing</span>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
            Transparent, Affordable Pricing
          </h1>
          <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.7 }}>
            No hidden fees. No surprises. Just honest pricing for quality digital solutions built for Nepal.
          </p>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>
            All prices are starting prices. Final cost depends on project scope.{" "}
            <Link href="/contact" style={{ color: "#2563eb", textDecoration: "none" }}>Get a custom quote →</Link>
          </p>
        </div>
      </div>

      {/* Project pricing */}
      <section className="section">
        <div className="container">
          {services.map(({ name, tiers }) => (
            <div key={name} style={{ marginBottom: 64 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 24 }}>{name}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {tiers.map(({ name: tier, price, desc, features, highlight }) => (
                  <div key={tier} style={{
                    background: highlight ? "#2563eb" : "white",
                    border: `1px solid ${highlight ? "#2563eb" : "#e5e7eb"}`,
                    borderRadius: 14, padding: 28,
                    position: "relative",
                  }}>
                    {highlight && (
                      <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#111827", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap" }}>
                        Most Popular
                      </span>
                    )}
                    <p style={{ fontSize: 14, fontWeight: 600, color: highlight ? "rgba(255,255,255,0.8)" : "#6b7280", marginBottom: 4 }}>{tier}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: highlight ? "white" : "#111827", marginBottom: 4, letterSpacing: "-0.02em" }}>{price}</p>
                    <p style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.7)" : "#9ca3af", marginBottom: 20 }}>{desc}</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {features.map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: highlight ? "rgba(255,255,255,0.9)" : "#374151" }}>
                          <CheckCircle size={14} color={highlight ? "rgba(255,255,255,0.8)" : "#2563eb"} style={{ flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
                      background: highlight ? "white" : "#2563eb",
                      color: highlight ? "#2563eb" : "white",
                    }}>
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly services */}
      <section className="section" style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb" }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Monthly Services</h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 32 }}>Ongoing services billed monthly. Cancel anytime.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {monthly.map(({ name, starter, pro, features }) => (
              <div key={name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 12 }}>{name}</h3>
                <div style={{ display: "flex", gap: 16, marginBottom: 16, padding: "12px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
                  <div><p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Starter</p><p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{starter}</p></div>
                  <div style={{ width: 1, background: "#e5e7eb" }} />
                  <div><p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Professional</p><p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{pro}</p></div>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" }}>
                      <CheckCircle size={13} color="#2563eb" style={{ flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#2563eb", padding: "72px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Not sure which plan is right for you?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Book a free 30-minute consultation and we&apos;ll recommend the best solution for your budget and goals.
          </p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#2563eb", padding: "13px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Book Free Consultation <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
