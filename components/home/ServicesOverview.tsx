import Link from "next/link";
import { Globe, Smartphone, ShoppingCart, Palette, Brain, Car, Hotel, CreditCard, Search, Server, Code, ArrowRight } from "lucide-react";

const DEFAULTS = {
  badge: "Services",
  heading: "What We Build",
  subheading: "End-to-end digital services from concept to deployment.",
  ctaLabel: "View All Services",
  ctaHref: "/services",
};

const defaultServices = [
  { icon: Globe, title: "Web Development", desc: "Fast, modern web apps built with React, Next.js, and Laravel." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Cross-platform Android & iOS apps with React Native." },
  { icon: ShoppingCart, title: "E-commerce", desc: "Complete online stores with payment integration." },
  { icon: Palette, title: "UI/UX Design", desc: "Clean, intuitive interfaces designed in Figma." },
  { icon: Brain, title: "AI Integration", desc: "Chatbots, recommendations, and automation." },
  { icon: Car, title: "Ride Sharing", desc: "Full ride-hailing platforms with real-time tracking." },
  { icon: Hotel, title: "Hotel Booking", desc: "Hotel management and online booking systems." },
  { icon: CreditCard, title: "Payment Gateway", desc: "eSewa, Khalti, Stripe, and more." },
  { icon: Search, title: "SEO & Marketing", desc: "Grow your organic traffic and online presence." },
  { icon: Server, title: "Hosting", desc: "Reliable hosting with 99.9% uptime." },
  { icon: Code, title: "Custom Software", desc: "Tailor-made solutions for your business needs." },
];

interface ServiceItem {
  title: string;
  desc: string;
}

interface ServicesOverviewProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  services?: ServiceItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ServicesOverview({
  badge,
  heading,
  subheading,
  services: customServices,
  ctaLabel,
  ctaHref,
}: ServicesOverviewProps = {}) {
  const data = {
    badge: badge ?? DEFAULTS.badge,
    heading: heading ?? DEFAULTS.heading,
    subheading: subheading ?? DEFAULTS.subheading,
    ctaLabel: ctaLabel ?? DEFAULTS.ctaLabel,
    ctaHref: ctaHref ?? DEFAULTS.ctaHref,
  };

  const displayServices = customServices && customServices.length > 0 ? customServices : defaultServices;

  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <span className="badge">{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
          <p className="section-subtitle">{data.subheading}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {displayServices.map(({ title, desc }) => {
            // Find icon if it exists in our static list, otherwise use a default
            const iconInfo = defaultServices.find(s => s.title === title);
            const Icon = iconInfo?.icon || Code;

            return (
              <div key={title} className="card" style={{ padding: "22px 24px" }}>
                <div style={{ width: 36, height: 36, background: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={18} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            );
          })}
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
