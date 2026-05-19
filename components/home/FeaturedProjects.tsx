import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULTS = {
  badge: "Portfolio",
  heading: "Featured Projects",
  subheading: "Products we've built that are making an impact in Nepal.",
  ctaLabel: "View All Projects",
  ctaHref: "/portfolio",
};

const defaultProjects = [
  {
    name: "StyleAura",
    category: "E-commerce Platform",
    desc: "Fashion e-commerce with AI style recommendations, multi-vendor support, and seamless checkout.",
    tech: ["Next.js", "Laravel", "MySQL", "AI/ML"],
    href: "/portfolio",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "RideSewa",
    category: "Ride Sharing App",
    desc: "Nepal's ride-hailing platform with real-time GPS tracking, driver management, and digital payments.",
    tech: ["React Native", "Node.js", "Socket.io", "Maps"],
    href: "/portfolio",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "HotelSewa",
    category: "Hotel Management",
    desc: "Complete hotel booking and management platform with reservations, billing, and analytics.",
    tech: ["React", "Laravel", "MySQL", "Stripe"],
    href: "/portfolio",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Siraha Bazaar",
    category: "Local Marketplace",
    desc: "Hyperlocal e-commerce connecting buyers and sellers in Siraha with delivery tracking.",
    tech: ["Next.js", "Laravel", "eSewa", "Khalti"],
    href: "/portfolio",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
  },
];

interface ProjectItem {
  name: string;
  category: string;
  desc: string;
  tech?: string[];
  href: string;
  image?: string;
}

interface FeaturedProjectsProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  projects?: ProjectItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function FeaturedProjects({
  badge,
  heading,
  subheading,
  projects: customProjects,
  ctaLabel,
  ctaHref,
}: FeaturedProjectsProps = {}) {
  const data = {
    badge: badge ?? DEFAULTS.badge,
    heading: heading ?? DEFAULTS.heading,
    subheading: subheading ?? DEFAULTS.subheading,
    ctaLabel: ctaLabel ?? DEFAULTS.ctaLabel,
    ctaHref: ctaHref ?? DEFAULTS.ctaHref,
  };

  const displayProjects = customProjects && customProjects.length > 0 ? customProjects : defaultProjects;

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <span className="badge">{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
          <p className="section-subtitle">{data.subheading}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {displayProjects.map(({ name, category, desc, tech, href, image }) => (
            <Link key={name} href={href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ height: "100%", cursor: "pointer", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: 180, overflow: "hidden" }}>
                  <img 
                    src={image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"} 
                    alt={name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    className="hover-scale"
                  />
                </div>
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    {category}
                  </p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{name}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
                    {(tech || []).map((t) => (
                      <span key={t} style={{ fontSize: 11, fontWeight: 500, color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <Link href={data.ctaHref} className="btn-outline">
            {data.ctaLabel} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
