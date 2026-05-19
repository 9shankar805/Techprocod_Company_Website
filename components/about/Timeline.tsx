const defaultMilestones = [
  { year: "2019", title: "Company Founded", desc: "Tech Procod was established in Siraha with a vision to digitize Nepal's businesses." },
  { year: "2020", title: "First Major Project", desc: "Delivered our first e-commerce platform, serving 500+ customers in Siraha district." },
  { year: "2021", title: "Team Expansion", desc: "Grew to a team of 5 developers and launched our mobile app development service." },
  { year: "2022", title: "RideSewa Launch", desc: "Launched Nepal's smart ride-sharing platform, RideSewa, in Siraha." },
  { year: "2023", title: "AI Integration", desc: "Added AI-powered features to our service portfolio, including chatbots and recommendation engines." },
  { year: "2024", title: "50+ Projects", desc: "Crossed 50 successful project deliveries with clients across Nepal and internationally." },
];

const defaults = {
  badge: "Our Journey",
  heading: "Company Timeline",
};

interface MilestoneItem {
  year: string;
  title: string;
  desc: string;
}

interface TimelineProps {
  badge?: string;
  heading?: string;
  milestones?: MilestoneItem[];
}

export default function Timeline({
  badge,
  heading,
  milestones: customMilestones,
}: TimelineProps) {
  const data = {
    badge: badge ?? defaults.badge,
    heading: heading ?? defaults.heading,
  };

  const milestones =
    Array.isArray(customMilestones) && customMilestones.length > 0
      ? customMilestones
      : defaultMilestones;

  return (
    <section className="section" style={{ background: "white" }}>
      <div className="container">
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <span className="badge" style={{ margin: "0 auto 12px" }}>{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
        </div>
        
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {milestones.map(({ year, title, desc }, i) => (
            <div
              key={year}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 40px 1fr",
                gap: 0,
              }}
            >
              {/* Year */}
              <div style={{ textAlign: "right", paddingRight: 24, paddingTop: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{year}</span>
              </div>

              {/* Line & Dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ 
                  width: 14, 
                  height: 14, 
                  borderRadius: "50%", 
                  background: "white", 
                  border: "3px solid #2563eb",
                  flexShrink: 0, 
                  zIndex: 1,
                  marginTop: 8
                }} />
                {i < milestones.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, #2563eb, #eff6ff)", margin: "4px 0" }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingLeft: 24, paddingBottom: i < milestones.length - 1 ? 48 : 0 }}>
                <div className="card" style={{ padding: 24, border: "none", background: "#f8fafc" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
