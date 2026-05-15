const items = [
  {
    title: "Our Mission",
    desc: "To empower Nepali businesses with cutting-edge digital solutions that are affordable, scalable, and built to last. We bridge the gap between global technology standards and local business needs.",
  },
  {
    title: "Our Vision",
    desc: "To become Nepal's most trusted technology company by 2030 — creating digital products that put Nepal on the global tech map and drive economic growth.",
  },
  {
    title: "Our Values",
    desc: "Quality over quantity. Transparency in every interaction. Innovation that solves real problems. And an unwavering commitment to our clients' success.",
  },
];

export default function MissionVision() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {items.map(({ title, desc }) => (
            <div key={title} className="card">
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
