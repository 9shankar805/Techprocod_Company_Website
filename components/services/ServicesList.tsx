import { Globe, Smartphone, ShoppingCart, Palette, Server, Search, Code, Car, Hotel, Brain, CreditCard, BarChart } from "lucide-react";

const services = [
  {
    id: "web", icon: Globe, title: "Web Development",
    desc: "Fast, modern, and scalable web applications using React, Next.js, and Laravel. From landing pages to complex platforms.",
    features: ["React / Next.js", "Laravel Backend", "REST & GraphQL APIs", "SEO Optimized", "Performance Tuned"],
  },
  {
    id: "mobile", icon: Smartphone, title: "Mobile App Development",
    desc: "Cross-platform mobile apps built with React Native that feel native on both Android and iOS.",
    features: ["React Native", "Android & iOS", "Push Notifications", "Offline Support", "App Store Deployment"],
  },
  {
    id: "ecommerce", icon: ShoppingCart, title: "E-commerce Solutions",
    desc: "Complete online stores with product management, cart, checkout, and payment integration.",
    features: ["Product Management", "eSewa / Khalti", "Order Tracking", "Inventory System", "Analytics Dashboard"],
  },
  {
    id: "design", icon: Palette, title: "UI/UX Design",
    desc: "Beautiful, intuitive interfaces designed in Figma and brought to life with clean code.",
    features: ["Figma Design", "Prototyping", "User Research", "Design Systems", "Responsive Layouts"],
  },
  {
    id: "ai", icon: Brain, title: "AI Integration",
    desc: "Add intelligence to your products with AI-powered chatbots, recommendations, and automation.",
    features: ["AI Chatbots", "Recommendations", "Image Recognition", "Process Automation", "OpenAI Integration"],
  },
  {
    id: "ride", icon: Car, title: "Ride Sharing Systems",
    desc: "Complete ride-hailing platforms with real-time GPS tracking, driver management, and digital payments.",
    features: ["Real-time GPS", "Driver App", "Passenger App", "Fare Engine", "Payment Integration"],
  },
  {
    id: "hotel", icon: Hotel, title: "Hotel Booking Systems",
    desc: "Full-featured hotel management platforms with room booking, availability calendar, and revenue analytics.",
    features: ["Room Management", "Online Booking", "Guest Portal", "Revenue Reports", "Channel Manager"],
  },
  {
    id: "payment", icon: CreditCard, title: "Payment Gateway",
    desc: "Secure payment integration with Nepal's leading gateways and international processors.",
    features: ["eSewa", "Khalti", "ConnectIPS", "Stripe", "PayPal"],
  },
  {
    id: "seo", icon: Search, title: "SEO & Digital Marketing",
    desc: "Data-driven SEO strategies and digital marketing to grow your online presence.",
    features: ["On-page SEO", "Technical SEO", "Content Strategy", "Social Media", "Google Ads"],
  },
  {
    id: "hosting", icon: Server, title: "Hosting Services",
    desc: "Reliable, fast, and secure hosting with 99.9% uptime SLA and 24/7 monitoring.",
    features: ["VPS Hosting", "SSL Certificates", "Daily Backups", "CDN Setup", "24/7 Monitoring"],
  },
  {
    id: "custom", icon: Code, title: "Custom Software",
    desc: "Tailor-made software solutions built specifically for your unique business requirements.",
    features: ["Requirements Analysis", "Custom Architecture", "API Development", "Integration", "Maintenance"],
  },
  {
    id: "analytics", icon: BarChart, title: "Analytics & Reporting",
    desc: "Custom dashboards and reporting tools that give you real-time insights into your business.",
    features: ["Custom Dashboards", "Real-time Data", "Google Analytics", "Business Reports", "KPI Tracking"],
  },
];

export default function ServicesList() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {services.map(({ id, icon: Icon, title, desc, features }) => (
            <div key={id} id={id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, background: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{title}</h3>
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
