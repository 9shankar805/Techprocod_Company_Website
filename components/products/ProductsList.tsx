import Link from "next/link";
import { Check } from "lucide-react";

const products = [
  {
    id: "pos", name: "POS System", tagline: "Smart Point of Sale",
    desc: "Complete point-of-sale for retail shops and restaurants. Manage sales, inventory, and reports from one dashboard.",
    features: ["Sales Management", "Inventory Tracking", "Receipt Printing", "Daily Reports", "Multi-user Access", "Barcode Scanner"],
    starter: "NPR 5,000/mo", pro: "NPR 10,000/mo", badge: "Popular",
  },
  {
    id: "hotel", name: "Hotel Management System", tagline: "Complete Hotel Operations",
    desc: "Manage your hotel end-to-end — bookings, room management, housekeeping, billing, and guest analytics.",
    features: ["Online Booking Engine", "Room Management", "Housekeeping Module", "Billing & Invoicing", "Guest CRM", "Revenue Reports"],
    starter: "NPR 8,000/mo", pro: "NPR 15,000/mo", badge: "Featured",
  },
  {
    id: "delivery", name: "Delivery Management System", tagline: "End-to-End Delivery Platform",
    desc: "Complete delivery management with order tracking, driver assignment, route optimization, and notifications.",
    features: ["Order Management", "Driver App", "Real-time Tracking", "Route Optimization", "Customer Notifications", "Analytics"],
    starter: "NPR 7,000/mo", pro: "NPR 12,000/mo", badge: null,
  },
  {
    id: "school", name: "School Management System", tagline: "Digital School Administration",
    desc: "Comprehensive school management covering student records, attendance, grades, fee collection, and parent communication.",
    features: ["Student Records", "Attendance System", "Grade Management", "Fee Collection", "Parent Portal", "Report Cards"],
    starter: "NPR 6,000/mo", pro: "NPR 11,000/mo", badge: null,
  },
  {
    id: "ecommerce", name: "E-commerce Platform", tagline: "Launch Your Online Store",
    desc: "Fully-featured e-commerce with product management, cart, checkout, payment integration, and seller dashboard.",
    features: ["Product Catalog", "Shopping Cart", "eSewa / Khalti", "Order Management", "Seller Dashboard", "SEO Tools"],
    starter: "NPR 9,000/mo", pro: "NPR 18,000/mo", badge: "New",
  },
];

interface ProductsListProps { content?: Record<string, unknown> }

export default function ProductsList({ content: _content }: ProductsListProps = {}) {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {products.map(({ id, name, tagline, desc, features, starter, pro, badge }) => (
            <div key={id} id={id} className="card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{tagline}</p>
                </div>
                {badge && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "3px 10px", borderRadius: 100, flexShrink: 0 }}>
                    {badge}
                  </span>
                )}
              </div>

              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: "14px 0 16px" }}>{desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 20 }}>
                {features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
                    <Check size={13} color="#22c55e" />
                    {f}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Starter</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{starter}</p>
                </div>
                <div style={{ width: 1, background: "#e5e7eb" }} />
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Professional</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{pro}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link href="/contact" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "9px 16px", fontSize: 13 }}>
                  Get Demo
                </Link>
                <Link href="/contact" className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: "9px 16px", fontSize: 13 }}>
                  Get Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
