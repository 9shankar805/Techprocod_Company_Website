interface PortfolioHeroProps { content?: Record<string, unknown> }

const defaultBadge = "Portfolio";
const defaultHeading = "Our Work";
const defaultSubheading = "Real products, real impact. Digital solutions we've built for businesses across Nepal.";

export default function PortfolioHero({ content }: PortfolioHeroProps = {}) {
  const badge = typeof content?.badge === "string" ? content.badge : defaultBadge;
  const heading = typeof content?.heading === "string" ? content.heading : defaultHeading;
  const subheading = typeof content?.subheading === "string" ? content.subheading : defaultSubheading;

  return (
    <section style={{ paddingTop: 100, paddingBottom: 56, borderBottom: "1px solid #e5e7eb" }}>
      <div className="container">
        <span className="badge">{badge}</span>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 16 }}>
          {heading}
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, maxWidth: 520 }}>
          {subheading}
        </p>
      </div>
    </section>
  );
}
