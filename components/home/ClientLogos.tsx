import React from "react";

const clients = [
  { name: "StyleAura", industry: "Fashion" },
  { name: "RideSewa", industry: "Transport" },
  { name: "HotelSewa", industry: "Hospitality" },
  { name: "Siraha Bazaar", industry: "E-commerce" },
  { name: "SchoolPro", industry: "Education" },
  { name: "FoodRun", industry: "Food Delivery" },
  { name: "MediCare Nepal", industry: "Healthcare" },
  { name: "AgriConnect", industry: "Agriculture" },
];

export default function ClientLogos() {
  return (
    <section style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", padding: "40px 0", overflow: "hidden", background: "white" }}>
      <div className="container" style={{ marginBottom: 24 }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Trusted by businesses across Nepal
        </p>
      </div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...clients, ...clients].map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 28px",
                background: "#f8f9fa",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                flexShrink: 0,
                minWidth: 140,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{client.name}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{client.industry}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: flex;
          gap: 12px;
          padding: 0 12px;
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
