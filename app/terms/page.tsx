import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Tech Procod Pvt Ltd",
  description: "Terms of Service for Tech Procod Pvt Ltd — the terms governing use of our services.",
};

const sections = [
  { id: "services", title: "1. Services" },
  { id: "payment", title: "2. Payment Terms" },
  { id: "intellectual-property", title: "3. Intellectual Property" },
  { id: "client-responsibilities", title: "4. Client Responsibilities" },
  { id: "limitation-liability", title: "5. Limitation of Liability" },
  { id: "termination", title: "6. Termination" },
  { id: "governing-law", title: "7. Governing Law" },
  { id: "changes", title: "8. Changes to Terms" },
];

export default function TermsPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "48px 0 40px" }}>
        <div className="container">
          <span className="badge">Legal</span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 12 }}>
            Terms of Service
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
              These Terms of Service (&quot;Terms&quot;) govern your use of services provided by Tech Procod Pvt Ltd (&quot;Tech Procod&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By engaging our services, you agree to be bound by these Terms. Please read them carefully.
            </p>

            <section id="services" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>1. Services</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Tech Procod provides digital solutions including web development, mobile app development, e-commerce solutions, UI/UX design, AI integration, SEO and digital marketing, custom software development, and hosting services.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                The specific scope of services for each project will be defined in a separate Statement of Work (SOW) or project proposal, which forms part of these Terms when agreed upon by both parties.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of services.
              </p>
            </section>

            <section id="payment" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>2. Payment Terms</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Payment terms are as follows:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {[
                  { title: "Project Deposit", desc: "A 50% deposit is required before work begins on any project." },
                  { title: "Milestone Payments", desc: "For larger projects, payments are tied to agreed milestones as defined in the SOW." },
                  { title: "Final Payment", desc: "The remaining balance is due upon project completion and before final delivery of files." },
                  { title: "Hosting & Maintenance", desc: "Monthly or annual fees are billed in advance and are non-refundable." },
                ].map(({ title, desc }) => (
                  <li key={title} style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 18px" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{title}</p>
                    <p style={{ fontSize: 14, color: "#6b7280" }}>{desc}</p>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                Invoices are payable within 7 days of issue. Late payments may incur a 2% monthly interest charge. We accept payment via bank transfer, eSewa, Khalti, and other agreed methods.
              </p>
            </section>

            <section id="intellectual-property" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>3. Intellectual Property</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Upon receipt of full payment, Tech Procod assigns to the client all intellectual property rights in the custom work created specifically for that client, including source code, designs, and content.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Tech Procod retains ownership of:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  "Pre-existing tools, frameworks, and libraries used in development",
                  "Generic code components and utilities not specific to the client project",
                  "Our internal development processes and methodologies",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                Tech Procod reserves the right to display completed work in our portfolio unless the client requests confidentiality in writing.
              </p>
            </section>

            <section id="client-responsibilities" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>4. Client Responsibilities</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                To ensure successful project delivery, clients are responsible for:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Providing accurate and complete project requirements",
                  "Providing timely feedback and approvals (within 5 business days unless otherwise agreed)",
                  "Providing all necessary content, images, and materials",
                  "Ensuring they have rights to all content provided to us",
                  "Designating a single point of contact for project communication",
                  "Making payments according to the agreed schedule",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="limitation-liability" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>5. Limitation of Liability</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                To the maximum extent permitted by applicable law, Tech Procod shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Our total liability for any claim arising from our services shall not exceed the total amount paid by the client for the specific service giving rise to the claim in the 12 months preceding the claim.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We do not warrant that our services will be uninterrupted, error-free, or completely secure. We provide services on an &quot;as is&quot; basis.
              </p>
            </section>

            <section id="termination" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>6. Termination</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Either party may terminate a project with 14 days written notice. Upon termination:
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "The client shall pay for all work completed up to the termination date",
                  "Tech Procod will deliver all completed work and materials",
                  "The initial deposit is non-refundable",
                  "Any work in progress will be billed at a pro-rated amount",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 9 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="governing-law" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>7. Governing Law</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Siraha District, Madhesh Pradesh, Nepal.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                Before initiating legal proceedings, both parties agree to attempt to resolve disputes through good-faith negotiation for a period of 30 days.
              </p>
            </section>

            <section id="changes" style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16, paddingTop: 8 }}>8. Changes to Terms</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                We reserve the right to modify these Terms at any time. We will notify existing clients of material changes via email. Continued use of our services after changes constitutes acceptance of the new Terms. We recommend reviewing these Terms periodically.
              </p>
            </section>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, display: "flex", gap: 16 }}>
              <Link href="/privacy" style={{ fontSize: 14, color: "#2563eb", textDecoration: "none" }}>Privacy Policy</Link>
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
