export default function AboutHero() {
  return (
    <section style={{ paddingTop: 100, paddingBottom: 64, borderBottom: "1px solid #e5e7eb" }}>
      <div className="container">
        <span className="badge">About Us</span>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 20, maxWidth: 600 }}>
          We Are Tech Procod
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.75, maxWidth: 600, marginBottom: 16 }}>
          Founded in Siraha, Nepal, Tech Procod Pvt Ltd is a team of developers, designers, and
          digital strategists dedicated to building world-class software for Nepali businesses.
        </p>
        <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.75, maxWidth: 560 }}>
          We believe technology should be accessible, powerful, and beautifully designed.
          From startups to enterprises, we partner with businesses to create digital products
          that make a real difference.
        </p>
      </div>
    </section>
  );
}
