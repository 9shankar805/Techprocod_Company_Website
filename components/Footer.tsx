"use client";
import { useState } from "react";
import Link from "next/link";
import { Code2, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

const cols = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Mobile Apps", href: "/services/mobile-app-development" },
      { label: "E-commerce", href: "/services/ecommerce-solutions" },
      { label: "AI Integration", href: "/services/ai-integration" },
      { label: "UI/UX Design", href: "/services/ui-ux-design" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "POS System", href: "/products" },
      { label: "Hotel Management", href: "/products" },
      { label: "Delivery System", href: "/products" },
      { label: "School Management", href: "/products" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("You're subscribed! Thanks for joining.", "success");
        setEmail("");
      } else {
        showToast(data.error || "Subscription failed. Please try again.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb" }}>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="container" style={{ padding: "60px 24px 40px" }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" className="footer-logo">
              <img 
                src="/assets/icon.jpg" 
                alt="TechProcod Icon" 
                style={{ height: 32, width: 32, borderRadius: 8, objectFit: "cover", display: "block", flexShrink: 0 }} 
              />
              <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                Tech<span style={{ color: "#2563eb" }}>Procod</span>{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 13 }}>Pvt Ltd</span>
              </span>
            </Link>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, maxWidth: 280, margin: "16px 0 20px" }}>
              Building smart digital solutions for Nepal. Web apps, mobile apps, and custom software that drive real results.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="mailto:info@techprocod.com.np" className="footer-contact-link">
                <Mail size={14} /> info@techprocod.com.np
              </a>
              <a href="mailto:support@techprocod.com.np" className="footer-contact-link">
                <Mail size={14} /> support@techprocod.com.np
              </a>
              <a href="tel:+9779705492297" className="footer-contact-link">
                <Phone size={14} /> +977-9705492297
              </a>
              <span className="footer-contact-link" style={{ cursor: "default" }}>
                <MapPin size={14} /> Siraha, Madhesh Pradesh, Nepal
              </span>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {col.title}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 40, paddingTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Stay updated</p>
              <p style={{ fontSize: 13, color: "#6b7280" }}>Get the latest news and insights from Tech Procod.</p>
            </div>
            <form onSubmit={handleNewsletter} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 240, fontSize: 13 }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={subLoading}
                style={{ padding: "10px 20px", fontSize: 13, opacity: subLoading ? 0.7 : 1 }}
              >
                {subLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "32px 0 24px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>© 2026 Tech Procod Pvt Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .footer-link {
          font-size: 14px;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #111827; }
        .footer-contact-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-contact-link:hover { color: #111827; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
