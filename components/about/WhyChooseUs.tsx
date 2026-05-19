import { CheckCircle2, Zap, ShieldCheck, Headphones, Repeat, BarChart3 } from 'lucide-react';

const defaultReasons = [
  { icon: CheckCircle2, title: "Proven Track Record", desc: "50+ successful projects delivered with 100% client satisfaction across Nepal." },
  { icon: Zap, title: "Agile & Fast Delivery", desc: "We work efficiently without compromising quality, meeting strict deadlines every time." },
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime for all our digital products." },
  { icon: Headphones, title: "24/7 Priority Support", desc: "Dedicated support team available round the clock for all your technical needs." },
  { icon: Repeat, title: "Transparent Process", desc: "Transparent, iterative development with regular updates and live demos." },
  { icon: BarChart3, title: "Scalable Solutions", desc: "Built to grow with your business — from local startups to global enterprises." },
];

const defaults = {
  badge: "Why Us",
  heading: "Why Choose Tech Procod",
};

interface ReasonItem {
  title: string;
  desc: string;
}

interface WhyChooseUsProps {
  badge?: string;
  heading?: string;
  values?: ReasonItem[];
}

export default function WhyChooseUs({
  badge,
  heading,
  values: customValues,
}: WhyChooseUsProps) {
  const data = {
    badge: badge ?? defaults.badge,
    heading: heading ?? defaults.heading,
  };

  const reasons =
    Array.isArray(customValues) && customValues.length > 0
      ? customValues
      : defaultReasons;

  return (
    <section className="section" style={{ background: "#f8fafc" }}>
      <div className="container">
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="badge" style={{ margin: "0 auto 12px" }}>{data.badge}</span>
          <h2 className="section-title">{data.heading}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {reasons.map(({ title, desc }, index) => {
            const Icon = (defaultReasons[index] as any)?.icon || CheckCircle2;
            return (
              <div key={title} className="card" style={{ padding: 32, border: "none", background: "white" }}>
                <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={24} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
