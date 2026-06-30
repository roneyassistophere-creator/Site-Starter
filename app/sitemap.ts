import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";
import siteConfig from "@/config/site";
import type { PostDoc, ProjectDoc } from "@/lib/types";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteConfig.url,              lastModified: new Date(), changeFrequency: "monthly",  priority: 1.0 },
  { url: `${siteConfig.url}/about`,    lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
  { url: `${siteConfig.url}/services`, lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
  { url: `${siteConfig.url}/portfolio`,lastModified: new Date(), changeFrequency: "weekly",   priority: 0.9 },
  { url: `${siteConfig.url}/blog`,     lastModified: new Date(), changeFrequency: "daily",    priority: 0.9 },
  { url: `${siteConfig.url}/contact`,  lastModified: new Date(), changeFrequency: "yearly",   priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let postEntries: MetadataRoute.Sitemap = [];
  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayloadClient();

    const [posts, projects] = await Promise.all([
      payload.find({
        collection: "posts",
        where: { status: { equals: "published" } },
        sort: "-publishedAt",
        limit: 1000,
        select: { slug: true, publishedAt: true },
      }),
      payload.find({
        collection: "projects",
        sort: "order",
        limit: 1000,
        select: { slug: true, date: true },
      }),
    ]);

    postEntries = (posts.docs as PostDoc[]).map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    projectEntries = (projects.docs as ProjectDoc[]).map((p) => ({
      url: `${siteConfig.url}/portfolio/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Payload unavailable during initial build — static routes still included.
  }

  return [...staticRoutes, ...postEntries, ...projectEntries];
}
