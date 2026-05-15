import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";

type Project = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
  features: string[];
  link?: string;
};

const projects: Project[] = [
  {
    slug: "styleaura",
    name: "StyleAura",
    category: "E-commerce Platform",
    tagline: "AI-powered fashion e-commerce for Nepal",
    description: "StyleAura is a modern fashion e-commerce platform built for a Kathmandu-based clothing brand. It features AI-powered style recommendations, a virtual try-on feature, multi-vendor support, and seamless checkout with eSewa and Khalti.",
    challenge: "The client needed a platform that could compete with international fashion sites while supporting local payment methods and handling Nepal's variable internet connectivity. They also wanted AI features to differentiate from competitors.",
    solution: "We built a Next.js frontend with a Laravel backend, integrating OpenAI's API for style recommendations. The virtual try-on feature uses computer vision to overlay clothing on user photos. We implemented aggressive caching and image optimization for performance on slow connections.",
    results: [
      "300% increase in online sales within 3 months of launch",
      "Average session duration increased from 1.2 to 4.8 minutes",
      "Cart abandonment rate reduced by 35%",
      "Mobile conversion rate improved by 60%",
    ],
    tech: ["Next.js", "Laravel", "MySQL", "OpenAI API", "eSewa", "Khalti", "Cloudflare CDN"],
    features: ["AI Style Recommendations", "Virtual Try-On", "Multi-vendor Support", "Real-time Inventory", "Order Tracking", "Loyalty Program"],
    link: "#",
  },
  {
    slug: "ridesewa",
    name: "RideSewa",
    category: "Ride Sharing Platform",
    tagline: "Nepal's smart ride-hailing platform",
    description: "RideSewa is a complete ride-hailing platform built for Siraha district. It includes separate driver and passenger apps, real-time GPS tracking, dynamic fare calculation, and digital payment integration.",
    challenge: "Building a ride-sharing platform for Nepal required handling unreliable internet connectivity, integrating local payment gateways, and building trust with both drivers and passengers in a market new to app-based transportation.",
    solution: "We built React Native apps with offline-first architecture. The backend uses Node.js with Socket.io for real-time communication, with automatic fallback to polling when WebSocket connections drop. We implemented a comprehensive driver onboarding system with document verification.",
    results: [
      "10,000+ rides completed in the first 6 months",
      "4.7-star average rating from passengers",
      "Driver earnings increased 30% vs traditional taxis",
      "Expanded from 1 to 4 cities within 8 months",
    ],
    tech: ["React Native", "Node.js", "Socket.io", "PostgreSQL", "Google Maps API", "eSewa", "Khalti"],
    features: ["Real-time GPS Tracking", "Driver & Passenger Apps", "Dynamic Fare Engine", "In-app Payments", "Trip History", "Driver Ratings"],
    link: "#",
  },
  {
    slug: "hotelsewa",
    name: "HotelSewa",
    category: "Hotel Management System",
    tagline: "Complete hotel operations in one platform",
    description: "HotelSewa is a full-featured hotel management and booking platform used by hotels across Madhesh Pradesh. It handles online bookings, room management, housekeeping, billing, and provides detailed revenue analytics.",
    challenge: "Hotel owners needed a system that was powerful enough to replace their manual processes but simple enough for staff with limited tech experience to use. The system also needed to handle the complexity of seasonal pricing and group bookings.",
    solution: "We built an intuitive web application with a clean interface that required minimal training. The booking engine supports complex pricing rules, seasonal rates, and group bookings. We integrated with popular OTAs for channel management.",
    results: [
      "Online bookings increased from 5% to 45% of total bookings",
      "Staff training time reduced from 2 weeks to 2 days",
      "Revenue per available room increased by 22%",
      "Now used by 15 hotels across Madhesh Pradesh",
    ],
    tech: ["React", "Laravel", "MySQL", "Stripe", "Twilio SMS", "Chart.js"],
    features: ["Online Booking Engine", "Room Management", "Housekeeping Module", "Billing & Invoicing", "Guest CRM", "Revenue Dashboard"],
    link: "#",
  },
  {
    slug: "siraha-bazaar",
    name: "Siraha Bazaar",
    category: "Local Marketplace",
    tagline: "Connecting buyers and sellers in Siraha",
    description: "Siraha Bazaar is a hyperlocal e-commerce marketplace connecting buyers and sellers within Siraha district. It supports multiple vendors, local delivery tracking, and both digital and cash payment options.",
    challenge: "Creating a marketplace that works for vendors with limited tech experience, supports cash on delivery alongside digital payments, and handles the logistics of local delivery in a district with varying road conditions.",
    solution: "We built a simplified vendor onboarding process with phone-based verification. The delivery system uses a network of local delivery partners with real-time tracking. We implemented a hybrid payment system supporting eSewa, Khalti, and cash on delivery.",
    results: [
      "200+ active vendors within 6 months",
      "5,000+ monthly active buyers",
      "Average delivery time of 4 hours within Siraha town",
      "NPR 50 lakh in monthly GMV by month 8",
    ],
    tech: ["Next.js", "Laravel", "MySQL", "eSewa", "Khalti", "Firebase", "Google Maps"],
    features: ["Multi-vendor Marketplace", "Delivery Tracking", "Vendor Dashboard", "Local Payments", "Order Management", "Review System"],
    link: "#",
  },
  {
    slug: "schoolpro",
    name: "SchoolPro",
    category: "School Management System",
    tagline: "Digital administration for modern schools",
    description: "SchoolPro is a comprehensive school management system used by 12 schools across Madhesh Pradesh. It manages student records, attendance, grades, fee collection, and provides a parent portal for real-time updates.",
    challenge: "Schools needed to digitize their paper-based processes without disrupting daily operations. The system needed to work for teachers with varying levels of tech literacy and support the Nepali academic calendar and grading system.",
    solution: "We built an intuitive system with role-based access for administrators, teachers, and parents. The attendance system uses QR codes for quick marking. Fee collection integrates with eSewa for digital payments while supporting cash receipts.",
    results: [
      "Administrative time reduced by 60%",
      "Fee collection efficiency improved by 80%",
      "Parent engagement increased with real-time updates",
      "Now managing 8,000+ student records across 12 schools",
    ],
    tech: ["React", "Laravel", "MySQL", "eSewa", "PDF Generation", "SMS Gateway"],
    features: ["Student Records", "Attendance System", "Grade Management", "Fee Collection", "Parent Portal", "Report Cards"],
    link: "#",
  },
  {
    slug: "foodrun",
    name: "FoodRun",
    category: "Food Delivery Platform",
    tagline: "Fast food delivery for Siraha",
    description: "FoodRun is a food delivery platform connecting restaurants in Siraha with customers. It features real-time order tracking, a restaurant management dashboard, and a delivery partner app.",
    challenge: "Building a food delivery platform that works with restaurants that have no existing digital infrastructure, while ensuring food quality through fast delivery and providing a seamless ordering experience.",
    solution: "We built a simple restaurant onboarding system with tablet-based order management. The delivery algorithm optimizes routes for multiple simultaneous deliveries. We implemented a real-time kitchen display system to reduce order preparation errors.",
    results: [
      "30+ restaurants onboarded in the first month",
      "Average delivery time of 35 minutes",
      "4.6-star average restaurant rating",
      "1,000+ orders processed in the first month",
    ],
    tech: ["React Native", "Laravel", "Firebase", "Google Maps", "eSewa", "Socket.io"],
    features: ["Restaurant Dashboard", "Real-time Tracking", "Order Management", "Delivery Partner App", "Rating System", "Promotions Engine"],
    link: "#",
  },
];

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} — ${project.category} | Tech Procod Portfolio`,
    description: project.description,
    openGraph: { title: project.name, description: project.tagline, type: "website" },
    alternates: { canonical: `https://techprocod.com/portfolio/${slug}` },
  };
}

export default async function PortfolioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "56px 0 48px" }}>
        <div className="container">
          <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6b7280", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={14} /> All Projects
          </Link>
          <span className="badge">{project.category}</span>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 44, fontWeight: 800, color: "#111827", lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.03em" }}>
                {project.name}
              </h1>
              <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 600, lineHeight: 1.7 }}>{project.tagline}</p>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ flexShrink: 0 }}>
                <ExternalLink size={15} /> View Live
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 56, alignItems: "start" }} className="portfolio-layout">
          <div>
            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16 }}>About the Project</h2>
              <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8 }}>{project.description}</p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16 }}>The Challenge</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>{project.challenge}</p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Our Solution</h2>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>{project.solution}</p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Results</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {project.results.map((r) => (
                  <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
                    <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 15, color: "#15803d", fontWeight: 500 }}>{r}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Key Features</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {project.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div style={{ position: "sticky", top: 88 }}>
              <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Tech Stack</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {project.tech.map((t) => (
                    <span key={t} style={{ fontSize: 12, color: "#374151", background: "white", border: "1px solid #e5e7eb", padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#2563eb", borderRadius: 12, padding: 24, color: "white" }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Want something similar?</p>
                <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, marginBottom: 16 }}>We can build a custom solution tailored to your business needs.</p>
                <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "white", color: "#2563eb", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  Get a Free Quote <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* More projects */}
      <div style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb", padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 28 }}>More Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {others.map((p) => (
              <Link key={p.slug} href={`/portfolio/${p.slug}`} style={{ textDecoration: "none" }}>
                <div className="card">
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{p.category}</p>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .portfolio-layout { grid-template-columns: 1fr 300px; }
        @media (max-width: 900px) { .portfolio-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
