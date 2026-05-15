import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  content: string[];
};

const posts: BlogPost[] = [
  {
    slug: "building-ride-sharing-app-nepal",
    title: "How We Built a Ride-Sharing App for Nepal",
    excerpt: "A deep dive into the technical challenges and solutions we encountered while building RideSewa — Nepal's smart ride-hailing platform.",
    category: "Case Study",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    author: "Rajesh Kumar Yadav",
    authorRole: "Lead Developer, Tech Procod",
    content: [
      "Building a ride-sharing application for Nepal presented unique challenges that differ significantly from markets like the US or India. Nepal's diverse geography, varying internet connectivity, and specific payment preferences required us to rethink many standard approaches.",
      "## The Challenge",
      "When we started building RideSewa, our primary concerns were: unreliable internet connectivity in many parts of Nepal, the need to support local payment gateways like eSewa and Khalti, real-time GPS tracking in areas with poor map data, and building trust with both drivers and passengers in a new market.",
      "## Our Technical Stack",
      "We chose React Native for the mobile apps to maintain a single codebase for both Android and iOS. The backend runs on Node.js with Socket.io for real-time communication. For the database, we used PostgreSQL with PostGIS extension for geospatial queries.",
      "The real-time tracking system uses WebSockets to push location updates every 3 seconds. We implemented a fallback to polling when WebSocket connections drop — a common occurrence in areas with weak signals.",
      "## Payment Integration",
      "Integrating eSewa and Khalti was straightforward thanks to their well-documented APIs. We implemented a wallet system within the app so users can top up their balance and pay without leaving the app. This reduced payment friction significantly.",
      "## Offline Capabilities",
      "One of our key innovations was building offline-first features. Drivers can accept rides even with intermittent connectivity. The app queues actions locally and syncs when connection is restored. This was critical for drivers operating in areas with poor coverage.",
      "## Results",
      "RideSewa launched in Siraha and has since expanded to three more cities. The app has processed over 10,000 rides in its first six months, with a 4.7-star average rating. Driver earnings have increased by 30% compared to traditional taxi services.",
      "## Lessons Learned",
      "Building for Nepal taught us to never assume reliable connectivity, to always provide offline fallbacks, and to deeply understand local payment preferences. These lessons now inform every project we take on.",
    ],
  },
  {
    slug: "nextjs-vs-laravel-nepal",
    title: "Next.js + Laravel: The Perfect Stack for Nepal",
    excerpt: "Why we chose Next.js for the frontend and Laravel for the backend, and how this combination delivers the best results for our clients.",
    category: "Tech",
    date: "Dec 10, 2024",
    readTime: "6 min read",
    author: "Priya Sharma",
    authorRole: "Full Stack Developer, Tech Procod",
    content: [
      "After building over 50 projects for Nepali businesses, we've settled on a stack that consistently delivers: Next.js on the frontend and Laravel on the backend. Here's why this combination works so well.",
      "## Why Next.js?",
      "Next.js gives us server-side rendering out of the box, which is crucial for SEO — something every Nepali business needs. The file-based routing system speeds up development, and the built-in image optimization is a lifesaver when clients upload unoptimized images.",
      "The App Router in Next.js 13+ has been a game-changer. We can mix server and client components, reducing JavaScript bundle sizes and improving performance on slower mobile connections.",
      "## Why Laravel?",
      "Laravel's elegant syntax and comprehensive ecosystem make it perfect for building robust APIs. Eloquent ORM handles complex database relationships cleanly, and Laravel's built-in authentication, queues, and caching systems save weeks of development time.",
      "For Nepali businesses, Laravel's multi-tenancy support is particularly valuable. Many of our clients need to serve multiple branches or franchises from a single codebase.",
      "## The Integration",
      "We use Laravel as a headless API backend and Next.js as the frontend. Communication happens via REST APIs with JWT authentication. This separation of concerns means we can scale the frontend and backend independently.",
      "## Performance in Nepal",
      "We deploy on servers in Singapore (closest to Nepal with good infrastructure) and use Cloudflare CDN. This gives us sub-200ms response times for most users. Next.js's static generation means many pages load from CDN cache, bypassing the server entirely.",
      "## When We Deviate",
      "For simple brochure websites, we sometimes use just Next.js with a headless CMS. For complex real-time applications, we add Node.js microservices alongside Laravel. But for 80% of projects, the Next.js + Laravel combination is our go-to.",
    ],
  },
  {
    slug: "ai-integration-nepali-business",
    title: "AI Integration for Nepali Businesses in 2025",
    excerpt: "How small and medium businesses in Nepal can leverage AI to automate processes, improve customer service, and drive growth.",
    category: "AI",
    date: "Dec 5, 2024",
    readTime: "5 min read",
    author: "Anish Thapa",
    authorRole: "AI Engineer, Tech Procod",
    content: [
      "Artificial intelligence is no longer just for tech giants. In 2025, Nepali businesses of all sizes can leverage AI to compete more effectively, reduce costs, and deliver better customer experiences.",
      "## Where AI Makes the Most Impact",
      "For Nepali businesses, we've found the highest ROI in three areas: customer service automation, inventory management, and personalized marketing.",
      "## AI Chatbots for Customer Service",
      "A well-trained chatbot can handle 70% of common customer queries — order status, product information, store hours — without human intervention. We've built chatbots for e-commerce stores that reduced customer service costs by 40% while improving response times from hours to seconds.",
      "The key is training the chatbot on your specific business data. We use a combination of OpenAI's GPT models and custom fine-tuning to create chatbots that understand Nepali business context.",
      "## Inventory Prediction",
      "AI-powered inventory management can predict demand based on historical sales, seasonal patterns, and even weather data. For a grocery chain in Siraha, we implemented an AI system that reduced stockouts by 35% and cut excess inventory by 20%.",
      "## Personalized Marketing",
      "AI can analyze customer behavior to send the right message at the right time. Instead of blasting the same email to all customers, AI segments your audience and personalizes content. This typically doubles email open rates and triples conversion rates.",
      "## Getting Started",
      "You don't need to build AI from scratch. We integrate existing AI services — OpenAI, Google AI, AWS AI — into your existing systems. The cost is surprisingly affordable: a basic AI chatbot integration starts at NPR 50,000.",
      "## The Future",
      "By 2026, we expect AI to be as standard as having a website. Businesses that adopt AI now will have a significant competitive advantage. The question isn't whether to adopt AI, but how quickly.",
    ],
  },
  {
    slug: "esewa-khalti-integration-guide",
    title: "Complete Guide to eSewa & Khalti Integration",
    excerpt: "Step-by-step guide to integrating Nepal's most popular payment gateways into your web or mobile application.",
    category: "Tutorial",
    date: "Nov 28, 2024",
    readTime: "10 min read",
    author: "Rajesh Kumar Yadav",
    authorRole: "Lead Developer, Tech Procod",
    content: [
      "Payment gateway integration is one of the most common requirements for Nepali web and mobile applications. This guide covers everything you need to know about integrating eSewa and Khalti.",
      "## eSewa Integration",
      "eSewa is Nepal's most popular digital wallet with over 7 million users. Their API supports both web and mobile integrations.",
      "### Getting Started with eSewa",
      "First, register as a merchant at merchant.esewa.com.np. You'll receive a merchant code and secret key. For testing, use the sandbox environment at uat.esewa.com.np.",
      "The basic flow is: your server creates a payment request, the user is redirected to eSewa, they authenticate and confirm payment, eSewa redirects back to your success/failure URL, and your server verifies the payment.",
      "### eSewa API Implementation",
      "The payment initiation requires a form POST to eSewa's endpoint with parameters including amount, tax amount, total amount, transaction UUID, product code, and HMAC signature. The HMAC signature is crucial for security — it prevents tampering with payment amounts.",
      "After payment, eSewa sends a callback to your server. Always verify the payment server-side using eSewa's verification API before fulfilling the order.",
      "## Khalti Integration",
      "Khalti offers a cleaner API experience with better documentation. Their Khalti Checkout v2 is the recommended integration method.",
      "### Khalti Setup",
      "Register at admin.khalti.com and get your public and secret keys. Khalti's test credentials are well-documented and easy to use.",
      "The Khalti flow is similar to eSewa but uses a JavaScript SDK for the frontend. Initialize the Khalti checkout with your public key and payment details, handle the success callback, and verify server-side.",
      "## Best Practices",
      "Always verify payments server-side — never trust client-side callbacks alone. Store transaction IDs and verify them before fulfilling orders. Implement idempotency to prevent double-charging. Log all payment events for debugging and reconciliation.",
      "## Testing",
      "Both eSewa and Khalti provide sandbox environments. Use test credentials extensively before going live. Test failure scenarios as much as success scenarios.",
    ],
  },
  {
    slug: "mobile-first-design-nepal",
    title: "Why Mobile-First Design Matters in Nepal",
    excerpt: "With 80%+ of Nepal's internet users on mobile, here's why mobile-first design is not optional — it's essential.",
    category: "Design",
    date: "Nov 20, 2024",
    readTime: "4 min read",
    author: "Priya Sharma",
    authorRole: "UI/UX Designer, Tech Procod",
    content: [
      "Nepal's internet landscape is fundamentally mobile. According to recent data, over 82% of Nepal's internet users access the web primarily through smartphones. If your website isn't optimized for mobile, you're ignoring the vast majority of your potential customers.",
      "## The Numbers Don't Lie",
      "Nepal has approximately 12 million internet users. Of these, over 10 million primarily use mobile devices. Desktop usage is concentrated in urban areas and office environments. For most Nepali businesses, mobile is the primary channel.",
      "## What Mobile-First Means",
      "Mobile-first design means designing for the smallest screen first, then progressively enhancing for larger screens. This is the opposite of the traditional approach of designing for desktop and then 'making it work' on mobile.",
      "The difference in outcomes is dramatic. Mobile-first sites load faster on mobile, have better usability on small screens, and typically rank higher in Google search results (Google uses mobile-first indexing).",
      "## Common Mobile Design Mistakes",
      "We see these mistakes constantly in Nepali websites: text too small to read without zooming, buttons too close together to tap accurately, forms with too many fields, images not optimized for mobile bandwidth, and navigation menus that don't work on touch screens.",
      "## Performance Matters More on Mobile",
      "Mobile users in Nepal often have slower connections. A page that loads in 2 seconds on fiber takes 8 seconds on a 3G connection. Every kilobyte matters. We optimize images, minimize JavaScript, and use lazy loading to ensure fast load times on all connections.",
      "## Practical Tips",
      "Use a minimum font size of 16px for body text. Make tap targets at least 44x44 pixels. Simplify navigation to the most important items. Test on actual devices, not just browser emulators. Use Google's PageSpeed Insights to measure mobile performance.",
      "## The Business Impact",
      "Our clients who switched to mobile-first design saw an average 45% increase in mobile conversions. One e-commerce client saw their mobile revenue triple after a mobile-first redesign. The investment pays for itself quickly.",
    ],
  },
  {
    slug: "techprocod-2024-year-review",
    title: "Tech Procod 2024: Year in Review",
    excerpt: "Looking back at our biggest milestones, projects, and lessons learned in 2024 — and what's coming in 2025.",
    category: "Company",
    date: "Nov 15, 2024",
    readTime: "7 min read",
    author: "Tech Procod Team",
    authorRole: "Tech Procod Pvt Ltd",
    content: [
      "2024 was a transformative year for Tech Procod. We grew our team, delivered our most ambitious projects yet, and established ourselves as one of Nepal's leading digital solutions companies. Here's a look back at what we accomplished.",
      "## By the Numbers",
      "In 2024, we delivered 18 major projects, grew our team from 8 to 15 members, served clients in 6 districts across Nepal, achieved a 98% client satisfaction rate, and crossed NPR 1 crore in annual revenue for the first time.",
      "## Biggest Projects",
      "RideSewa was our most technically challenging project — a full ride-hailing platform with real-time GPS, driver and passenger apps, and payment integration. It launched in Q2 and has been growing steadily.",
      "StyleAura, our AI-powered fashion e-commerce platform, was our most innovative project. The virtual try-on feature using AI was a first for Nepal's e-commerce space.",
      "SchoolPro, our school management system, is now used by 12 schools across Madhesh Pradesh, managing over 8,000 student records.",
      "## Team Growth",
      "We hired 7 new team members in 2024, including our first dedicated AI engineer and two UI/UX designers. Our team now includes specialists in React Native, Laravel, AI/ML, and digital marketing.",
      "## Challenges We Overcame",
      "2024 wasn't without challenges. We navigated power outages during critical project deadlines, managed remote work across multiple cities, and adapted to rapidly changing AI tools and frameworks. Each challenge made us more resilient.",
      "## What's Coming in 2025",
      "In 2025, we're launching our own SaaS products — a POS system and a hotel management platform. We're also expanding our AI services and planning to open a second office in Kathmandu. Most excitingly, we're launching a developer training program to help grow Nepal's tech talent pool.",
      "## Thank You",
      "None of this would be possible without our clients, who trusted us with their digital transformation, and our team, who worked tirelessly to deliver excellence. Here's to an even bigger 2025.",
    ],
  },
];

function getRelatedPosts(currentSlug: string): BlogPost[] {
  return posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Tech Procod Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const postUrl = `https://techprocod.com/blog/${slug}`;
  const whatsappText = encodeURIComponent(`Check out this article: ${post.title} - ${postUrl}`);

  return (
    <>
      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "48px 0 40px" }}>
          <div className="container">
            <Link
              href="/blog"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6b7280", textDecoration: "none", marginBottom: 24 }}
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 12 }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", lineHeight: 1.2, maxWidth: 720, marginBottom: 16, letterSpacing: "-0.02em" }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 640, lineHeight: 1.7, marginBottom: 24 }}>{post.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={16} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{post.author}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{post.authorRole}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9ca3af" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={13} /> {post.date}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={13} /> {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ padding: "48px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }} className="blog-layout">
            {/* Main content */}
            <article>
              {post.content.map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2 key={i} style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "36px 0 14px", letterSpacing: "-0.01em" }}>
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={i} style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "24px 0 10px" }}>
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                return (
                  <p key={i} style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 18 }}>
                    {block}
                  </p>
                );
              })}

              {/* Share */}
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 48, paddingTop: 32 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Share this article</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <ShareCopyButton url={postUrl} />
                  <a
                    href={`https://wa.me/?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#25d366", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                  >
                    <WhatsAppIcon /> Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* Author */}
              <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 12, padding: 28, marginTop: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <div style={{ width: 52, height: 52, background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={22} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{post.author}</p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>{post.authorRole}</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                  The team at Tech Procod Pvt Ltd builds digital solutions for businesses across Nepal. We specialize in web development, mobile apps, e-commerce, and AI integration.
                </p>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div style={{ position: "sticky", top: 88 }}>
                <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Related Posts
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {related.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.category}</span>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.4, marginTop: 4 }}>{r.title}</p>
                          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{r.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#2563eb", borderRadius: 12, padding: 24, color: "white" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Need a digital solution?</p>
                  <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, marginBottom: 16 }}>
                    We build web apps, mobile apps, and custom software for Nepali businesses.
                  </p>
                  <Link href="/contact" style={{ display: "inline-block", background: "white", color: "#2563eb", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                    Get a Free Quote
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related posts bottom */}
        <div style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb", padding: "60px 0" }}>
          <div className="container">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 28 }}>More Articles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card">
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.category}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "8px 0 10px", lineHeight: 1.4 }}>{r.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{r.excerpt}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>{r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blog-layout { grid-template-columns: 1fr 280px; }
        @media (max-width: 900px) {
          .blog-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// Client component for copy link
import ShareCopyButton from "./ShareCopyButton";
