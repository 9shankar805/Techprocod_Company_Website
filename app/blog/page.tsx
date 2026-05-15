import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog | Tech Articles, Tutorials & Digital Insights | Tech Procod Nepal",
  description:
    "Read Tech Procod's blog for insights on web development, mobile apps, AI integration, e-commerce, and digital marketing in Nepal. Tutorials, case studies, and tech news.",
  keywords: [
    "tech blog Nepal",
    "web development articles",
    "mobile app tutorials",
    "AI integration guide",
    "e-commerce tips",
    "digital marketing Nepal",
    "tech news",
    "programming tutorials",
  ],
  openGraph: {
    title: "Tech Blog | Articles & Insights",
    description: "Web development, mobile apps, AI, e-commerce, and digital marketing insights",
    url: "https://techprocod.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://techprocod.com/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogGrid />
    </>
  );
}
