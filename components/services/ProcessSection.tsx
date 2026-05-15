const steps = [
  { step: "01", title: "Discovery Call", desc: "Free consultation to understand your goals, requirements, and vision." },
  { step: "02", title: "Proposal & Planning", desc: "Detailed project proposal with timeline, tech stack, and cost breakdown." },
  { step: "03", title: "Design & Development", desc: "We design and build your product with regular updates and demos." },
  { step: "04", title: "Testing & Launch", desc: "Thorough QA testing followed by a smooth deployment to production." },
  { step: "05", title: "Support & Growth", desc: "Ongoing maintenance, updates, and support to keep your product running." },
];

export default function ProcessSection() {
  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="badge">How We Work</span>
          <h2 className="section-title">Our Process</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {steps.map(({ step, title, desc }) => (
            <div key={step} style={{ padding: "24px 0" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#e5e7eb", marginBottom: 12, lineHeight: 1 }}>{step}</p>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
