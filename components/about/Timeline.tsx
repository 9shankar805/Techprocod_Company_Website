const milestones = [
  { year: "2019", title: "Company Founded", desc: "Tech Procod was established in Siraha with a vision to digitize Nepal's businesses." },
  { year: "2020", title: "First Major Project", desc: "Delivered our first e-commerce platform, serving 500+ customers in Siraha district." },
  { year: "2021", title: "Team Expansion", desc: "Grew to a team of 5 developers and launched our mobile app development service." },
  { year: "2022", title: "RideSewa Launch", desc: "Launched Nepal's smart ride-sharing platform, RideSewa, in Siraha." },
  { year: "2023", title: "AI Integration", desc: "Added AI-powered features to our service portfolio, including chatbots and recommendation engines." },
  { year: "2024", title: "50+ Projects", desc: "Crossed 50 successful project deliveries with clients across Nepal and internationally." },
];

export default function Timeline() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="badge">Our Journey</span>
          <h2 className="section-title">Company Timeline</h2>
        </div>
        <div style={{ maxWidth: 640 }}>
          {milestones.map(({ year, title, desc }, i) => (
            <div
              key={year}
              style={{
                display: "flex",
                gap: 24,
                paddingBottom: i < milestones.length - 1 ? 32 : 0,
                marginBottom: i < milestones.length - 1 ? 0 : 0,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 5 }} />
                {i < milestones.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: "#e5e7eb", marginTop: 6 }} />
                )}
              </div>
              <div style={{ paddingBottom: i < milestones.length - 1 ? 32 : 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em" }}>{year}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "4px 0 6px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
