interface AboutHeroProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  image?: string;
}

const defaults = {
  badge: "About Us",
  heading: "We Are Tech Procod",
  subheading:
    "Founded in Siraha, Nepal, Tech Procod Pvt Ltd is a team of developers, designers, and digital strategists dedicated to building world-class software for Nepali businesses.",
  body: "We believe technology should be accessible, powerful, and beautifully designed. From startups to enterprises, we partner with businesses to create digital products that make a real difference.",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
};

export default function AboutHero({
  badge,
  heading,
  subheading,
  body,
  image,
}: AboutHeroProps) {
  const data = {
    badge: badge ?? defaults.badge,
    heading: heading ?? defaults.heading,
    subheading: subheading ?? defaults.subheading,
    body: body ?? defaults.body,
    image: image ?? defaults.image,
  };

  return (
    <section style={{ paddingTop: 100, paddingBottom: 100, borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <span className="badge" style={{ marginBottom: 20 }}>{data.badge}</span>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>
              {data.heading}
            </h1>
            <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
              {data.subheading}
            </p>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>
              {data.body}
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ 
              position: "absolute", 
              inset: "-15px", 
              border: "2px solid #e2e8f0", 
              borderRadius: 24, 
              zIndex: 0,
              transform: "rotate(3deg)"
            }} />
            <img 
              src={data.image} 
              alt="About Tech Procod" 
              style={{ 
                width: "100%", 
                height: "auto", 
                borderRadius: 20, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: 1
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
