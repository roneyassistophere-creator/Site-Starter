import { getPayloadClient } from "@/lib/payload";
import siteConfig from "@/config/site";
import type { PostDoc } from "@/lib/types";

export const revalidate = 3600; // regenerate at most once per hour

export async function GET() {
  let posts: PostDoc[] = [];
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 50,
    });
    posts = docs as PostDoc[];
  } catch {
    posts = [];
  }

  const siteUrl = siteConfig.url;
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : buildDate;
      const link = `${siteUrl}/blog/${post.slug}`;
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ""}
      ${post.author ? `<author>${post.author}</author>` : ""}
      ${(post.categories ?? []).map((c) => `<category>${c.category}</category>`).join("")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.name} Blog]]></title>
    <link>${siteUrl}/blog</link>
    <description><![CDATA[${siteConfig.seo.defaultDescription}]]></description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
