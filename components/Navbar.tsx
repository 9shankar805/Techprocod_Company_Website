"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Code2 } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <Code2 size={16} color="white" />
            </div>
            <span className="navbar-logo-text">
              Tech<span style={{ color: "#2563eb" }}>Procod</span>
            </span>
          </Link>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="navbar-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-cta">
            <Link href="/contact" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
              Get a Quote
            </Link>
          </div>

          <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="navbar-mobile">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary" style={{ marginTop: 8, justifyContent: "center" }} onClick={() => setMobileOpen(false)}>
              Get a Quote
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          background: white;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .navbar-scrolled {
          border-bottom-color: #e5e7eb;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .navbar-logo-icon {
          width: 32px; height: 32px;
          background: #2563eb;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .navbar-logo-text {
          font-weight: 700;
          font-size: 16px;
          color: #111827;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .navbar-link {
          padding: 6px 12px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .navbar-link:hover {
          background: #f3f4f6;
          color: #111827;
        }
        .navbar-cta { display: flex; }
        .navbar-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #374151;
        }
        .navbar-mobile {
          border-top: 1px solid #e5e7eb;
          background: white;
          padding: 12px 24px 16px;
          display: flex;
          flex-direction: column;
        }
        .navbar-mobile-link {
          display: block;
          padding: 10px 0;
          font-size: 15px;
          color: #374151;
          text-decoration: none;
          border-bottom: 1px solid #f3f4f6;
        }
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-cta { display: none; }
          .navbar-toggle { display: block; }
        }
      `}</style>
    </>
  );
}
