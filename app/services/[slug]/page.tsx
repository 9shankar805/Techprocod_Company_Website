import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";

type ServiceData = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  process: { step: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  related: string[];
};

const services: ServiceData[] = [
  {
    slug: "web-development",
    title: "Web Development",
    tagline: "Fast, modern, and scalable web applications",
    description: "We build high-performance web applications using React, Next.js, and Laravel. From landing pages to complex enterprise platforms, we deliver solutions that are fast, secure, and built to scale.",
    benefits: [
      "SEO-optimized from day one",
      "Mobile-first responsive design",
      "Sub-2-second load times",
      "Secure and scalable architecture",
      "Ongoing maintenance and support",
      "Integration with any third-party service",
    ],
    process: [
      { step: "01", title: "Discovery", desc: "We understand your business goals, target audience, and technical requirements through detailed consultation." },
      { step: "02", title: "Design", desc: "Our designers create wireframes and high-fidelity mockups in Figma for your approval before any code is written." },
      { step: "03", title: "Development", desc: "We build your application using modern frameworks with clean, maintainable code and regular progress updates." },
      { step: "04", title: "Testing", desc: "Rigorous testing across devices, browsers, and network conditions ensures a flawless user experience." },
      { step: "05", title: "Launch", desc: "We deploy to production, configure CDN and SSL, and monitor performance during the critical launch period." },
      { step: "06", title: "Support", desc: "Post-launch support, bug fixes, and feature additions keep your application running smoothly." },
    ],
    faq: [
      { q: "How long does a web development project take?", a: "A typical website takes 4-8 weeks. Complex web applications can take 3-6 months. We provide a detailed timeline after the discovery phase." },
      { q: "What technologies do you use?", a: "We primarily use Next.js and React for the frontend, Laravel for the backend, and MySQL/PostgreSQL for databases. We choose the best tool for each project." },
      { q: "Do you provide hosting?", a: "Yes, we offer managed hosting on VPS servers with SSL, daily backups, and 24/7 monitoring. We can also deploy to your preferred cloud provider." },
      { q: "Can you redesign my existing website?", a: "Absolutely. We can redesign your existing site while preserving your SEO rankings and migrating all your content." },
    ],
    related: ["ui-ux-design", "seo-marketing", "hosting-services"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    tagline: "Cross-platform apps that feel native",
    description: "We build cross-platform mobile applications using React Native that deliver native performance on both Android and iOS. From concept to App Store, we handle the entire development lifecycle.",
    benefits: [
      "Single codebase for Android and iOS",
      "Native performance and feel",
      "Offline-first architecture",
      "Push notification support",
      "App Store and Play Store deployment",
      "Ongoing updates and maintenance",
    ],
    process: [
      { step: "01", title: "Requirements", desc: "We map out all features, user flows, and technical requirements before writing a single line of code." },
      { step: "02", title: "UI/UX Design", desc: "Mobile-specific designs optimized for touch interactions, small screens, and platform conventions." },
      { step: "03", title: "Development", desc: "React Native development with regular builds shared via TestFlight and Play Store internal testing." },
      { step: "04", title: "Backend API", desc: "We build the supporting API infrastructure for authentication, data storage, and third-party integrations." },
      { step: "05", title: "Testing", desc: "Testing on real devices across multiple Android versions and iOS versions to ensure compatibility." },
      { step: "06", title: "Deployment", desc: "App Store and Play Store submission, including all metadata, screenshots, and compliance requirements." },
    ],
    faq: [
      { q: "Do you build for both Android and iOS?", a: "Yes. We use React Native to build a single codebase that runs natively on both platforms, reducing cost and development time." },
      { q: "How much does a mobile app cost?", a: "A basic app starts at NPR 2,00,000. Feature-rich apps with backend integration typically range from NPR 5,00,000 to 15,00,000." },
      { q: "Can you integrate eSewa and Khalti?", a: "Yes, we have extensive experience integrating Nepal's payment gateways including eSewa, Khalti, and ConnectIPS." },
      { q: "Do you provide app maintenance?", a: "Yes, we offer monthly maintenance packages that include bug fixes, OS compatibility updates, and minor feature additions." },
    ],
    related: ["web-development", "ui-ux-design", "ecommerce-solutions"],
  },
  {
    slug: "ecommerce-solutions",
    title: "E-commerce Solutions",
    tagline: "Complete online stores that drive sales",
    description: "We build complete e-commerce platforms with product management, cart, checkout, and payment integration. From single-vendor stores to multi-vendor marketplaces, we deliver solutions that convert visitors into customers.",
    benefits: [
      "eSewa and Khalti payment integration",
      "Multi-vendor marketplace support",
      "Inventory management system",
      "Order tracking and notifications",
      "Analytics and sales reporting",
      "Mobile-optimized shopping experience",
    ],
    process: [
      { step: "01", title: "Business Analysis", desc: "Understanding your product catalog, pricing strategy, and customer journey to design the optimal store architecture." },
      { step: "02", title: "Store Design", desc: "Creating a conversion-optimized design that builds trust and makes purchasing easy." },
      { step: "03", title: "Development", desc: "Building the store with product management, cart, checkout, and all required integrations." },
      { step: "04", title: "Payment Setup", desc: "Integrating and testing all payment gateways with sandbox and live environments." },
      { step: "05", title: "Content Migration", desc: "Migrating your existing product catalog, images, and customer data to the new platform." },
      { step: "06", title: "Launch & Training", desc: "Launching the store and training your team on managing products, orders, and customers." },
    ],
    faq: [
      { q: "Which payment gateways do you support?", a: "We support eSewa, Khalti, ConnectIPS, Stripe, and cash on delivery. We can integrate any payment gateway with an API." },
      { q: "Can you build a multi-vendor marketplace?", a: "Yes, we've built several multi-vendor marketplaces including Siraha Bazaar. We handle vendor onboarding, commission management, and payouts." },
      { q: "How do you handle inventory management?", a: "We build custom inventory systems with stock tracking, low-stock alerts, and automatic out-of-stock handling." },
      { q: "Can you migrate my existing store?", a: "Yes, we can migrate from WooCommerce, Shopify, or any other platform while preserving your SEO rankings." },
    ],
    related: ["web-development", "seo-marketing", "mobile-app-development"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    tagline: "Beautiful interfaces that users love",
    description: "We create intuitive, beautiful user interfaces designed in Figma and brought to life with clean code. Our design process is research-driven, ensuring every design decision is backed by user insights.",
    benefits: [
      "User research and persona development",
      "Wireframing and prototyping",
      "High-fidelity Figma designs",
      "Design system creation",
      "Usability testing",
      "Handoff-ready design files",
    ],
    process: [
      { step: "01", title: "Research", desc: "User interviews, competitor analysis, and heuristic evaluation to understand the design landscape." },
      { step: "02", title: "Information Architecture", desc: "Organizing content and features into a logical structure that users can navigate intuitively." },
      { step: "03", title: "Wireframing", desc: "Low-fidelity wireframes to establish layout and flow before investing in visual design." },
      { step: "04", title: "Visual Design", desc: "High-fidelity designs with your brand colors, typography, and visual language." },
      { step: "05", title: "Prototyping", desc: "Interactive prototypes in Figma for stakeholder review and user testing." },
      { step: "06", title: "Handoff", desc: "Developer-ready design files with specifications, assets, and component documentation." },
    ],
    faq: [
      { q: "Do you create design systems?", a: "Yes, we create comprehensive design systems with reusable components, color palettes, typography scales, and usage guidelines." },
      { q: "Can you redesign an existing product?", a: "Absolutely. We conduct a UX audit of your existing product and redesign it based on user feedback and best practices." },
      { q: "What tools do you use?", a: "We primarily use Figma for design and prototyping. We also use Maze for user testing and Zeplin for developer handoff." },
      { q: "Do you do user testing?", a: "Yes, we conduct moderated and unmoderated user testing sessions to validate design decisions before development." },
    ],
    related: ["web-development", "mobile-app-development", "ecommerce-solutions"],
  },
  {
    slug: "ai-integration",
    title: "AI Integration",
    tagline: "Add intelligence to your products",
    description: "We integrate AI capabilities into your existing products and build AI-powered features from scratch. From chatbots to recommendation engines, we make AI practical and affordable for Nepali businesses.",
    benefits: [
      "AI chatbots for customer service",
      "Product recommendation engines",
      "Image recognition and processing",
      "Process automation with AI",
      "Natural language processing",
      "Predictive analytics",
    ],
    process: [
      { step: "01", title: "Use Case Analysis", desc: "Identifying where AI can deliver the most value in your specific business context." },
      { step: "02", title: "Data Assessment", desc: "Evaluating your existing data and identifying what additional data is needed for AI training." },
      { step: "03", title: "Model Selection", desc: "Choosing the right AI models and services — OpenAI, Google AI, or custom models — for your use case." },
      { step: "04", title: "Integration", desc: "Building the integration layer between AI services and your existing systems." },
      { step: "05", title: "Training & Fine-tuning", desc: "Training models on your specific data to improve accuracy and relevance." },
      { step: "06", title: "Monitoring", desc: "Ongoing monitoring of AI performance and continuous improvement based on real-world usage." },
    ],
    faq: [
      { q: "How much does AI integration cost?", a: "A basic AI chatbot integration starts at NPR 50,000. More complex AI features like recommendation engines start at NPR 1,50,000." },
      { q: "Do I need a lot of data to use AI?", a: "Not necessarily. Many AI services work well with minimal data. We assess your situation and recommend the right approach." },
      { q: "Can AI work in Nepali language?", a: "Yes, modern AI models support Nepali language. We've built chatbots that handle both Nepali and English queries." },
      { q: "How do you ensure AI accuracy?", a: "We implement feedback loops, regular model evaluation, and human oversight to continuously improve AI accuracy." },
    ],
    related: ["web-development", "custom-software", "ecommerce-solutions"],
  },
  {
    slug: "seo-marketing",
    title: "SEO & Digital Marketing",
    tagline: "Grow your online presence and drive results",
    description: "We help Nepali businesses rank higher on Google and reach their target audience through data-driven SEO and digital marketing strategies. From technical SEO to content marketing, we cover the full spectrum.",
    benefits: [
      "Higher Google search rankings",
      "Increased organic traffic",
      "Better conversion rates",
      "Social media growth",
      "Monthly performance reports",
      "ROI-focused campaigns",
    ],
    process: [
      { step: "01", title: "SEO Audit", desc: "Comprehensive audit of your current website's technical SEO, content, and backlink profile." },
      { step: "02", title: "Keyword Research", desc: "Identifying high-value keywords that your target customers are searching for in Nepal." },
      { step: "03", title: "On-page Optimization", desc: "Optimizing title tags, meta descriptions, content, and internal linking structure." },
      { step: "04", title: "Technical SEO", desc: "Fixing technical issues like page speed, mobile usability, structured data, and crawlability." },
      { step: "05", title: "Content Strategy", desc: "Creating and optimizing content that ranks for target keywords and converts visitors." },
      { step: "06", title: "Reporting", desc: "Monthly reports showing rankings, traffic, and conversions with actionable insights." },
    ],
    faq: [
      { q: "How long does SEO take to show results?", a: "SEO is a long-term strategy. You can expect to see meaningful results in 3-6 months, with significant improvements in 6-12 months." },
      { q: "Do you run Google Ads?", a: "Yes, we manage Google Ads campaigns alongside SEO for immediate traffic while organic rankings build." },
      { q: "Can you help with social media?", a: "Yes, we manage Facebook, Instagram, and LinkedIn accounts with content creation and paid advertising." },
      { q: "How do you measure success?", a: "We track keyword rankings, organic traffic, conversion rates, and revenue attributed to organic search." },
    ],
    related: ["web-development", "ecommerce-solutions", "ui-ux-design"],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    tagline: "Tailor-made solutions for unique business needs",
    description: "When off-the-shelf software doesn't fit your business, we build custom solutions from scratch. We've built ERP systems, inventory management tools, HR platforms, and more for Nepali businesses.",
    benefits: [
      "Built exactly to your specifications",
      "Integrates with your existing systems",
      "Scales with your business",
      "No recurring license fees",
      "Full ownership of the code",
      "Ongoing support and enhancements",
    ],
    process: [
      { step: "01", title: "Requirements Gathering", desc: "Detailed workshops to document all functional and non-functional requirements." },
      { step: "02", title: "System Architecture", desc: "Designing a scalable, maintainable architecture that meets current and future needs." },
      { step: "03", title: "Agile Development", desc: "Building in sprints with regular demos so you can provide feedback throughout development." },
      { step: "04", title: "Integration", desc: "Connecting with your existing tools, databases, and third-party services." },
      { step: "05", title: "User Acceptance Testing", desc: "Your team tests the software against requirements before final delivery." },
      { step: "06", title: "Training & Handover", desc: "Comprehensive training for your team and complete documentation of the system." },
    ],
    faq: [
      { q: "How do you handle changing requirements?", a: "We use agile methodology with regular sprint reviews. Changes are accommodated through a formal change request process." },
      { q: "Who owns the code?", a: "You do. We transfer full ownership of all source code upon project completion." },
      { q: "Can you maintain the software after delivery?", a: "Yes, we offer annual maintenance contracts that include bug fixes, security updates, and minor enhancements." },
      { q: "How do you ensure software quality?", a: "We follow coding standards, conduct code reviews, write automated tests, and perform thorough QA testing." },
    ],
    related: ["web-development", "ai-integration", "hosting-services"],
  },
  {
    slug: "hosting-services",
    title: "Hosting Services",
    tagline: "Reliable, fast, and secure hosting",
    description: "We provide managed hosting services with 99.9% uptime SLA, daily backups, SSL certificates, and 24/7 monitoring. Your website stays fast, secure, and online — always.",
    benefits: [
      "99.9% uptime SLA",
      "Daily automated backups",
      "Free SSL certificates",
      "CDN for global performance",
      "24/7 server monitoring",
      "DDoS protection",
    ],
    process: [
      { step: "01", title: "Assessment", desc: "Evaluating your traffic, storage, and performance requirements to recommend the right hosting plan." },
      { step: "02", title: "Server Setup", desc: "Configuring your VPS with optimized settings for your specific application stack." },
      { step: "03", title: "Migration", desc: "Migrating your existing website or application with zero downtime." },
      { step: "04", title: "SSL & CDN", desc: "Setting up SSL certificates and CDN for security and global performance." },
      { step: "05", title: "Monitoring", desc: "Configuring uptime monitoring, performance alerts, and security scanning." },
      { step: "06", title: "Ongoing Management", desc: "Regular server updates, security patches, and performance optimization." },
    ],
    faq: [
      { q: "Where are your servers located?", a: "Our primary servers are in Singapore for optimal performance in Nepal. We also offer servers in India and the US." },
      { q: "What happens if my site goes down?", a: "Our monitoring system alerts us immediately. We have a 1-hour response SLA for critical issues." },
      { q: "Do you offer email hosting?", a: "Yes, we offer business email hosting with custom domains, spam filtering, and webmail access." },
      { q: "Can you host high-traffic websites?", a: "Yes, we offer scalable VPS and dedicated server options that can handle millions of monthly visitors." },
    ],
    related: ["web-development", "custom-software", "ecommerce-solutions"],
  },
];

const serviceNames: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-app-development": "Mobile App Development",
  "ecommerce-solutions": "E-commerce Solutions",
  "ui-ux-design": "UI/UX Design",
  "ai-integration": "AI Integration",
  "seo-marketing": "SEO & Marketing",
  "custom-software": "Custom Software",
  "hosting-services": "Hosting Services",
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | Tech Procod Pvt Ltd`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "56px 0 48px" }}>
        <div className="container">
          <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6b7280", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={14} /> All Services
          </Link>
          <span className="badge">{service.title}</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111827", lineHeight: 1.15, maxWidth: 640, marginBottom: 16, letterSpacing: "-0.02em" }}>
            {service.tagline}
          </h1>
          <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 580, lineHeight: 1.7, marginBottom: 32 }}>{service.description}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Get a Free Quote <ArrowRight size={15} /></Link>
            <Link href="#process" className="btn-outline">See Our Process</Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 8 }}>What You Get</h2>
          <p className="section-subtitle" style={{ marginBottom: 40 }}>Everything included in our {service.title.toLowerCase()} service.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {service.benefits.map((benefit) => (
              <div key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section" style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 8 }}>Our Process</h2>
          <p className="section-subtitle" style={{ marginBottom: 48 }}>A proven process that delivers results on time and on budget.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {service.process.map(({ step, title, desc }) => (
              <div key={step} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#eff6ff", marginBottom: 12, lineHeight: 1 }}>{step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="section-title" style={{ marginBottom: 8 }}>Frequently Asked Questions</h2>
          <p className="section-subtitle" style={{ marginBottom: 40 }}>Common questions about our {service.title.toLowerCase()} service.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {service.faq.map(({ q, a }) => (
              <div key={q} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{q}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section" style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb" }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Related Services</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {service.related.map((relSlug) => (
              <Link
                key={relSlug}
                href={`/services/${relSlug}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}
              >
                {serviceNames[relSlug] || relSlug} <ArrowRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#2563eb", padding: "72px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Let&apos;s discuss your project and build something great together.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#2563eb", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Get a Free Quote <ArrowRight size={15} />
            </Link>
            <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "white", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
