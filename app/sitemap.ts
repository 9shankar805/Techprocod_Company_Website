import { MetadataRoute } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://techprocod.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [blogSnap, portfolioSnap] = await Promise.all([
      adminDb.collection("blog").where("status", "==", "Published").get(),
      adminDb.collection("portfolio").where("status", "==", "Published").get(),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = blogSnap.docs.map(d => ({
      url: `${base}/blog/${d.data().slug || d.id}`,
      lastModified: d.data().updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = portfolioSnap.docs.map(d => ({
      url: `${base}/portfolio/${d.data().slug || d.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}
