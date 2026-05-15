"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How much does a website cost in Nepal?", a: "A basic business website starts at NPR 30,000. E-commerce stores start at NPR 60,000. Complex web applications are priced based on requirements. We provide a detailed quote after a free consultation." },
  { q: "How long does it take to build a website?", a: "A simple website takes 2-4 weeks. An e-commerce store takes 4-8 weeks. Complex web applications take 2-4 months. We provide a detailed timeline after understanding your requirements." },
  { q: "Do you support eSewa and Khalti payments?", a: "Yes, we have extensive experience integrating eSewa, Khalti, ConnectIPS, and other Nepali payment gateways. We also support international gateways like Stripe and PayPal." },
  { q: "Can you build mobile apps for Android and iOS?", a: "Yes, we build cross-platform mobile apps using React Native that work natively on both Android and iOS from a single codebase, reducing cost and development time." },
  { q: "Do you provide hosting and maintenance?", a: "Yes, we offer managed hosting starting at NPR 3,000/month with 99.9% uptime, SSL, daily backups, and 24/7 monitoring. We also offer monthly maintenance packages." },
  { q: "Can you redesign my existing website?", a: "Absolutely. We can redesign your existing website while preserving your SEO rankings and migrating all your content. We start with a UX audit to identify improvement areas." },
  { q: "Do you work with clients outside Siraha?", a: "Yes, we work with clients across Nepal and internationally. Most of our communication happens via video calls, email, and WhatsApp, so location is not a barrier." },
  { q: "What happens after the project is delivered?", a: "All projects include 1 month of free support after launch. We offer ongoing maintenance packages for bug fixes, updates, and feature additions beyond that period." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section" style={{ borderTop: "1px solid #e5e7eb" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }} className="faq-layout">
          <div>
            <span className="badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              Can&apos;t find your answer? <a href="/contact" style={{ color: "#2563eb", textDecoration: "none" }}>Contact us</a> and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map(({ q, a }, i) => (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "white" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{q}</span>
                  <ChevronDown size={16} color="#9ca3af" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {open === i && (
                  <div style={{ padding: "0 20px 16px", borderTop: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, paddingTop: 12 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-layout { grid-template-columns: 1fr 2fr; }
        @media (max-width: 768px) { .faq-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
