import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    name: "StyleAura",
    category: "E-commerce Platform",
    desc: "Fashion e-commerce with AI style recommendations, multi-vendor support, and seamless checkout.",
    tech: ["Next.js", "Laravel", "MySQL", "AI/ML"],
    href: "/portfolio",
  },
  {
    name: "RideSewa",
    category: "Ride Sharing App",
    desc: "Nepal's ride-hailing platform with real-time GPS tracking, driver management, and digital payments.",
    tech: ["React Native", "Node.js", "Socket.io", "Maps"],
    href: "/portfolio",
  },
  {
    name: "HotelSewa",
    category: "Hotel Management",
    desc: "Complete hotel booking and management platform with reservations, billing, and analytics.",
    tech: ["React", "Laravel", "MySQL", "Stripe"],
    href: "/portfolio",
  },
  {
    name: "Siraha Bazaar",
    category: "Local Marketplace",
    desc: "Hyperlocal e-commerce connecting buyers and sellers in Siraha with delivery tracking.",
    tech: ["Next.js", "Laravel", "eSewa", "Khalti"],
    href: "/portfolio",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <span className="badge">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Products we&apos;ve built that are making an impact in Nepal.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {projects.map(({ name, category, desc, tech, href }) => (
            <Link key={name} href={href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ height: "100%", cursor: "pointer" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  {category}
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{name}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {tech.map((t) => (
                    <span key={t} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 100 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <Link href="/portfolio" className="btn-outline">
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
