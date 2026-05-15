const techs = [
  "React", "Next.js", "Laravel", "TypeScript", "Tailwind CSS",
  "MySQL", "React Native", "Node.js", "Python", "Docker", "AWS", "Figma",
];

export default function TechStack() {
  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <span className="badge">Tech Stack</span>
          <h2 className="section-title">Technologies We Use</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {techs.map((t) => (
            <span
              key={t}
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
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
