import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#e5e7eb",
            lineHeight: 1,
            marginBottom: 8,
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#6b7280",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#2563eb",
              color: "white",
              padding: "11px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go Home
          </Link>
          <Link
            href="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              color: "#374151",
              padding: "11px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #e5e7eb",
            }}
          >
            Our Services
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              color: "#374151",
              padding: "11px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #e5e7eb",
            }}
          >
            Contact Us
          </Link>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9ca3af",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: "#2563eb",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>T</span>
          </div>
          Tech Procod Pvt Ltd
        </div>
      </div>
    </div>
  );
}
