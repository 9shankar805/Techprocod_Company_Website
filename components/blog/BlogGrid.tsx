import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

interface BlogPost { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string }

interface BlogGridProps { content?: Record<string, unknown> }

function isValidPosts(val: unknown): val is BlogPost[] {
  return Array.isArray(val) && val.length > 0 && val.every(
    (p) => p && typeof p === "object" && "slug" in p && "title" in p && "excerpt" in p
  );
}

const defaultPosts: BlogPost[] = [
  {
    slug: "building-ride-sharing-app-nepal",
    title: "How We Built a Ride-Sharing App for Nepal",
    excerpt: "A deep dive into the technical challenges and solutions we encountered while building RideSewa — Nepal's smart ride-hailing platform.",
    category: "Case Study", date: "Dec 15, 2024", readTime: "8 min read",
  },
  {
    slug: "nextjs-vs-laravel-nepal",
    title: "Next.js + Laravel: The Perfect Stack for Nepal",
    excerpt: "Why we chose Next.js for the frontend and Laravel for the backend, and how this combination delivers the best results for our clients.",
    category: "Tech", date: "Dec 10, 2024", readTime: "6 min read",
  },
  {
    slug: "ai-integration-nepali-business",
    title: "AI Integration for Nepali Businesses in 2025",
    excerpt: "How small and medium businesses in Nepal can leverage AI to automate processes, improve customer service, and drive growth.",
    category: "AI", date: "Dec 5, 2024", readTime: "5 min read",
  },
  {
    slug: "esewa-khalti-integration-guide",
    title: "Complete Guide to eSewa & Khalti Integration",
    excerpt: "Step-by-step guide to integrating Nepal's most popular payment gateways into your web or mobile application.",
    category: "Tutorial", date: "Nov 28, 2024", readTime: "10 min read",
  },
  {
    slug: "mobile-first-design-nepal",
    title: "Why Mobile-First Design Matters in Nepal",
    excerpt: "With 80%+ of Nepal's internet users on mobile, here's why mobile-first design is not optional — it's essential.",
    category: "Design", date: "Nov 20, 2024", readTime: "4 min read",
  },
  {
    slug: "techprocod-2024-year-review",
    title: "Tech Procod 2024: Year in Review",
    excerpt: "Looking back at our biggest milestones, projects, and lessons learned in 2024 — and what's coming in 2025.",
    category: "Company", date: "Nov 15, 2024", readTime: "7 min read",
  },
];

export default function BlogGrid({ content }: BlogGridProps = {}) {
  const posts = isValidPosts(content?.posts) ? (content.posts as BlogPost[]) : defaultPosts;
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {posts.map(({ slug, title, excerpt, category, date, readTime }) => (
            <Link key={slug} href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
              <article className="card" style={{ height: "100%", cursor: "pointer" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {category}
                </span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "8px 0 10px", lineHeight: 1.4 }}>
                  {title}
                </h2>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 20 }}>{excerpt}</p>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", marginTop: "auto" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
