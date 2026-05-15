const team = [
  { name: "Founder / CEO", role: "Full Stack Developer & Visionary", initials: "TP", bio: "Leading Tech Procod with a passion for building digital solutions that matter for Nepal." },
  { name: "Lead Developer", role: "Backend & API Architect", initials: "LD", bio: "Expert in Laravel, Node.js, and scalable system architecture." },
  { name: "UI/UX Designer", role: "Product Designer", initials: "UX", bio: "Crafting beautiful, intuitive interfaces that users love." },
  { name: "Mobile Developer", role: "React Native Specialist", initials: "MD", bio: "Building cross-platform mobile apps with native performance." },
  { name: "DevOps Engineer", role: "Cloud & Infrastructure", initials: "DO", bio: "Ensuring our products are fast, secure, and always available." },
  { name: "SEO Specialist", role: "Digital Marketing", initials: "SE", bio: "Driving organic growth and digital visibility for our clients." },
];

export default function TeamSection() {
  return (
    <section id="team" className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="badge">The Team</span>
          <h2 className="section-title">Meet the People</h2>
          <p className="section-subtitle">Builders, designers, and strategists working together to create great products.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {team.map(({ name, role, initials, bio }) => (
            <div key={name} className="card" style={{ textAlign: "center" }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#eff6ff",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                {initials}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{name}</h3>
              <p style={{ fontSize: 13, color: "#2563eb", marginBottom: 10 }}>{role}</p>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
