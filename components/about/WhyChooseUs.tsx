const reasons = [
  { title: "Proven Track Record", desc: "50+ successful projects delivered with 100% client satisfaction." },
  { title: "Fast Delivery", desc: "We work efficiently without compromising quality, meeting deadlines every time." },
  { title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime for all our products." },
  { title: "24/7 Support", desc: "Dedicated support team available round the clock for all your needs." },
  { title: "Agile Process", desc: "Transparent, iterative development with regular updates and demos." },
  { title: "Scalable Solutions", desc: "Built to grow with your business — from startup to enterprise scale." },
];

export default function WhyChooseUs() {
  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="badge">Why Us</span>
          <h2 className="section-title">Why Choose Tech Procod</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {reasons.map(({ title, desc }) => (
            <div key={title} style={{ padding: "20px 0", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
