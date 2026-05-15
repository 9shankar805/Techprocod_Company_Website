import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh Sharma",
    role: "CEO, Siraha Bazaar",
    content: "Tech Procod built our entire marketplace from scratch. Professional team, on-time delivery, and the product exceeded our expectations. Sales have grown 3x since launch.",
    rating: 5,
  },
  {
    name: "Priya Thapa",
    role: "Founder, StyleAura",
    content: "Outstanding UI/UX design and development quality. They understood our vision perfectly and delivered a beautiful, fast e-commerce platform. Highly recommended.",
    rating: 5,
  },
  {
    name: "Bikash Yadav",
    role: "Operations Manager, RideSewa",
    content: "Our ride-sharing app works flawlessly. Real-time tracking, smooth payments, and a great driver app. Tech Procod's technical expertise is top-notch.",
    rating: 5,
  },
  {
    name: "Sunita Jha",
    role: "Owner, Hotel Sunrise",
    content: "The hotel management system has completely transformed how we operate. Bookings, room management, and reporting — all in one place. Excellent work.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <span className="badge">Testimonials</span>
          <h2 className="section-title">What Clients Say</h2>
          <p className="section-subtitle">Feedback from businesses we&apos;ve helped grow.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map(({ name, role, content, rating }) => (
            <div key={name} className="card">
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
                &ldquo;{content}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{name}</p>
                <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
