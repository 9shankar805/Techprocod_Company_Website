export default function BlogHero() {
  return (
    <section style={{ paddingTop: 100, paddingBottom: 56, borderBottom: "1px solid #e5e7eb" }}>
      <div className="container">
        <span className="badge">Blog</span>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 16 }}>
          Insights & Updates
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, maxWidth: 480 }}>
          Tech articles, tutorials, company news, and insights from the Tech Procod team.
        </p>
      </div>
    </section>
  );
}
