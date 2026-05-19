const defaultItems = [
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

interface MissionItem {
  title: string;
  desc: string;
}

interface MissionVisionProps {
  items?: MissionItem[];
}

export default function MissionVision({ items: customItems }: MissionVisionProps) {
  const items =
    Array.isArray(customItems) && customItems.length > 0
      ? customItems
      : defaultItems;

  return (
    <section className="section" style={{ background: "white" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {items.map(({ title, desc }, index) => (
            <div key={title} className="card" style={{ padding: 40, border: "none", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
              <div style={{ 
                position: "absolute", 
                top: -20, 
                right: -20, 
                fontSize: 120, 
                fontWeight: 900, 
                color: "#f1f5f9", 
                zIndex: 0,
                lineHeight: 1
              }}>
                {index + 1}
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>{title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
