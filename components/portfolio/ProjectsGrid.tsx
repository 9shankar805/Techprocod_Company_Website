"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

const categories = ["All", "Web App", "Mobile App", "E-commerce", "Platform"];

const projects = [
  {
    id: "styleaura", name: "StyleAura", category: "E-commerce",
    tags: ["E-commerce", "Web App"],
    desc: "Fashion e-commerce with AI style recommendations, virtual try-on, and seamless checkout.",
    tech: ["Next.js", "Laravel", "MySQL", "AI/ML", "Stripe"],
    features: ["AI Style Recommendations", "Virtual Try-On", "Multi-vendor Support", "Real-time Inventory"],
  },
  {
    id: "ridesewa", name: "RideSewa", category: "Mobile App",
    tags: ["Mobile App", "Platform"],
    desc: "Nepal's ride-hailing app with real-time GPS tracking, driver management, and digital payments.",
    tech: ["React Native", "Node.js", "Socket.io", "Google Maps", "eSewa"],
    features: ["Real-time GPS Tracking", "Driver & Passenger Apps", "Dynamic Fare Engine", "In-app Payments"],
  },
  {
    id: "hotelsewa", name: "HotelSewa", category: "Web App",
    tags: ["Web App", "Platform"],
    desc: "Complete hotel management and booking platform with reservations, guest portal, and analytics.",
    tech: ["React", "Laravel", "MySQL", "Stripe", "Twilio"],
    features: ["Room Management", "Online Booking", "Guest Portal", "Revenue Dashboard"],
  },
  {
    id: "sirahababazaar", name: "Siraha Bazaar", category: "E-commerce",
    tags: ["E-commerce", "Web App"],
    desc: "Hyperlocal marketplace connecting buyers and sellers in Siraha with delivery tracking.",
    tech: ["Next.js", "Laravel", "MySQL", "eSewa", "Khalti"],
    features: ["Multi-vendor Marketplace", "Delivery Tracking", "Local Payments", "Seller Dashboard"],
  },
  {
    id: "schoolpro", name: "SchoolPro", category: "Web App",
    tags: ["Web App"],
    desc: "School management system with student records, attendance, grades, and parent portal.",
    tech: ["React", "Laravel", "MySQL", "PDF Generation"],
    features: ["Student Management", "Attendance System", "Grade Reports", "Fee Management"],
  },
  {
    id: "foodrun", name: "FoodRun", category: "Mobile App",
    tags: ["Mobile App", "Platform"],
    desc: "Food delivery platform connecting restaurants with customers, with real-time order tracking.",
    tech: ["React Native", "Laravel", "Firebase", "Google Maps"],
    features: ["Restaurant Dashboard", "Real-time Tracking", "Order Management", "Rating System"],
  },
];

export default function ProjectsGrid() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <section className="section">
      <div className="container">
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.15s",
                background: active === cat ? "#2563eb" : "white",
                color: active === cat ? "white" : "#374151",
                borderColor: active === cat ? "#2563eb" : "#e5e7eb",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filtered.map(({ id, name, category, desc, tech, features }) => (
            <div key={id} id={id} className="card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                    {category}
                  </p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{name}</h3>
                </div>
                <a href="#" style={{ color: "#9ca3af", padding: 4 }}>
                  <ExternalLink size={15} />
                </a>
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 14 }}>{desc}</p>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Key Features
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                  {features.map((f) => (
                    <li key={f} style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#9ca3af", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tech.map((t) => (
                  <span key={t} style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "3px 10px", borderRadius: 100 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
