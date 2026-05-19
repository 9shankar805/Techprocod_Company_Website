"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

type Testimonial = { id?: string; name: string; role: string; content: string; rating: number; image?: string };

const FALLBACK: Testimonial[] = [
  { 
    name: "Ramesh Sharma", 
    role: "CEO, Siraha Bazaar", 
    content: "Tech Procod built our entire marketplace from scratch. Professional team, on-time delivery, and the product exceeded our expectations. Sales have grown 3x since launch.", 
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
  },
  { 
    name: "Priya Thapa", 
    role: "Founder, StyleAura", 
    content: "Outstanding UI/UX design and development quality. They understood our vision perfectly and delivered a beautiful, fast e-commerce platform. Highly recommended.", 
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    name: "Bikash Yadav", 
    role: "Operations Manager, RideSewa", 
    content: "Our ride-sharing app works flawlessly. Real-time tracking, smooth payments, and a great driver app. Tech Procod's technical expertise is top-notch.", 
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  },
  { 
    name: "Sunita Jha", 
    role: "Owner, Hotel Sunrise", 
    content: "The hotel management system has completely transformed how we operate. Bookings, room management, and reporting — all in one place. Excellent work.", 
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
];

const DEFAULTS = {
  badge: "Testimonials",
  heading: "What Clients Say",
  subheading: "Feedback from businesses we've helped grow.",
};

interface TestimonialsProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
}

export default function Testimonials({
  badge,
  heading,
  subheading,
  testimonials: customTestimonials,
}: TestimonialsProps = {}) {
  const data = {
    badge: badge ?? DEFAULTS.badge,
    heading: heading ?? DEFAULTS.heading,
    subheading: subheading ?? DEFAULTS.subheading,
  };

  const [fetchedTestimonials, setFetchedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Only fetch if no custom testimonials are provided via props
    if (Array.isArray(customTestimonials) && customTestimonials.length > 0) return;

    fetch("/api/admin/testimonials").then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length > 0) setFetchedTestimonials(d);
    }).catch(() => {});
  }, [customTestimonials]);

  const displayTestimonials =
    Array.isArray(customTestimonials) && customTestimonials.length > 0
      ? customTestimonials
      : fetchedTestimonials.length > 0
      ? fetchedTestimonials
      : FALLBACK;

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <span className="badge">{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
          <p className="section-subtitle">{data.subheading}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {displayTestimonials.map(({ name, role, content: text, rating, image }) => (
            <div key={name} className="card" style={{ display: "flex", flexDirection: "column", padding: 32 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < rating ? "#f59e0b" : "transparent"} 
                    color={i < rating ? "#f59e0b" : "#e5e7eb"} 
                  />
                ))}
              </div>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24, flex: 1, fontStyle: "italic" }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#f1f5f9" }}>
                  <img 
                    src={image || `https://ui-avatars.com/api/?name=${name}&background=eff6ff&color=2563eb`} 
                    alt={name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{name}</p>
                  <p style={{ fontSize: 13, color: "#64748b", marginTop: 1, fontWeight: 500 }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
