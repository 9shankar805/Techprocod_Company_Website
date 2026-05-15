import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Tech Procod Pvt Ltd",
  description: "Privacy Policy for Tech Procod Pvt Ltd — how we collect, use, and protect your personal information.",
};

const sections = [
  { id: "data-collection", title: "1. Data Collection" },
  { id: "data-usage", title: "2. How We Use Your Data" },
  { id: "cookies", title: "3. Cookies" },
  { id: "third-parties", title: "4. Third Parties" },
  { id: "data-security", title: "5. Data Security" },
  { id: "your-rights", title: "6. Your Rights" },
  { id: "contact", title: "7. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "48px 0 40px" }}>
        <div className="container">
          <span className="badge">Legal</span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 15, color: "#6b7280" }}>Last updated: December 15, 2024</p>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 48, alignItems: "start" }} className="legal-layout">
          {/* Table of Contents */}
          <aside>
            <div style={{ position: "sticky", top: 88, background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                Contents
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} style={{ fontSize: 13, color: "#6b7280", textDecoration: "none", lineHeight: 1.4 }}>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 32 }}>
              Tech Procod Pvt Ltd (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at techprocod.com or use our services.
            </p>

            <section id="data-collection" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>1. Data Collection</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or request a quote. This may include:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  "Name and contact information (email address, phone number)",
                  "Business information (company name, industry, project requirements)",
                  "Communication preferences",
                  "Any other information you choose to provide",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages visited. This is collected through standard web server logs and analytics tools.
              </p>
            </section>

            <section id="data-usage" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>2. How We Use Your Data</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                We use the information we collect to:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Respond to your inquiries and provide requested services",
                  "Send you project updates, invoices, and service-related communications",
                  "Send newsletters and marketing communications (with your consent)",
                  "Improve our website and services based on usage patterns",
                  "Comply with legal obligations",
                  "Prevent fraud and ensure security",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="cookies" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>3. Cookies</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files stored on your device.
              </p>
              <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f1f3f5" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Type</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Essential", purpose: "Required for the website to function properly" },
                      { type: "Analytics", purpose: "Help us understand how visitors use our site (Google Analytics)" },
                      { type: "Preferences", purpose: "Remember your settings and preferences" },
                    ].map((row, i) => (
                      <tr key={row.type} style={{ borderBottom: i < 2 ? "1px solid #e5e7eb" : "none" }}>
                        <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 500 }}>{row.type}</td>
                        <td style={{ padding: "12px 16px", color: "#6b7280" }}>{row.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section id="third-parties" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>4. Third Parties</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                We may share your information with trusted third-party service providers who assist us in operating our website and delivering services:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  "Google Analytics — website usage analytics",
                  "Resend — transactional email delivery",
                  "Cloudflare — CDN and security services",
                  "Payment processors (eSewa, Khalti) — for processing payments",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section id="data-security" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>5. Data Security</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is transmitted over HTTPS. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section id="your-rights" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>6. Your Rights</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                You have the right to:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Access the personal information we hold about you",
                  "Request correction of inaccurate information",
                  "Request deletion of your personal information",
                  "Opt out of marketing communications at any time",
                  "Request a copy of your data in a portable format",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="contact" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>7. Contact Us</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
                <p style={{ fontSize: 15, color: "#374151", marginBottom: 6 }}><strong>Tech Procod Pvt Ltd</strong></p>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Siraha, Madhesh Pradesh, Nepal</p>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Email: <a href="mailto:info@techprocod.com" style={{ color: "#2563eb" }}>info@techprocod.com</a></p>
                <p style={{ fontSize: 14, color: "#6b7280" }}>Phone: +977-9800000000</p>
              </div>
            </section>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, display: "flex", gap: 16 }}>
              <Link href="/terms" style={{ fontSize: 14, color: "#2563eb", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="/contact" style={{ fontSize: 14, color: "#2563eb", textDecoration: "none" }}>Contact Us</Link>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        .legal-layout { grid-template-columns: 220px 1fr; }
        @media (max-width: 768px) {
          .legal-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
