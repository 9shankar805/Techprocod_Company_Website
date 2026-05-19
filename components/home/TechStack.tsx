const DEFAULTS = {
  badge: "Tech Stack",
  heading: "Technologies We Use",
  techs: [
    { name: "React" },
    { name: "Next.js" },
    { name: "Laravel" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" },
    { name: "MySQL" },
    { name: "React Native" },
    { name: "Node.js" },
    { name: "Python" },
    { name: "Docker" },
    { name: "AWS" },
    { name: "Figma" },
  ],
};

interface TechItem {
  name: string;
}

interface TechStackProps {
  badge?: string;
  heading?: string;
  techs?: TechItem[];
}

export default function TechStack({
  badge,
  heading,
  techs,
}: TechStackProps = {}) {
  const data = {
    badge: badge ?? DEFAULTS.badge,
    heading: heading ?? DEFAULTS.heading,
    techs: Array.isArray(techs) && techs.length > 0 ? techs : DEFAULTS.techs,
  };

  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <span className="badge">{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {data.techs.map((t) => (
            <span
              key={t.name}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
                background: "white",
                border: "1px solid #e5e7eb",
                padding: "8px 18px",
                borderRadius: 8,
              }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
