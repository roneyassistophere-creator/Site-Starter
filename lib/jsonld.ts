import type { SettingsDoc, PostDoc, ProjectDoc, MediaDoc } from "./types";
import siteConfig from "@/config/site";

function mediaUrl(m: MediaDoc | string | null | undefined) {
  if (!m) return undefined;
  if (typeof m === "string") return m;
  return m.url;
}

export function organizationJsonLd(settings: SettingsDoc) {
  const org = settings.organization;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org?.name ?? settings.siteName ?? siteConfig.name,
    url: org?.url ?? siteConfig.url,
    logo: mediaUrl(settings.logo as MediaDoc | null) ?? `${siteConfig.url}${siteConfig.logoPath}`,
    email: org?.email,
    telephone: org?.phone,
    address: org?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: org.address.streetAddress,
          addressLocality: org.address.city,
          addressRegion: org.address.region,
          postalCode: org.address.postalCode,
          addressCountry: org.address.country ?? "US",
        }
      : undefined,
    sameAs: org?.socialProfiles?.map((p) => p.url) ?? siteConfig.socialLinks.map((s) => s.href),
  };
}

export function websiteJsonLd(settings: SettingsDoc) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName ?? siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  crumbs: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : `${siteConfig.url}${c.href}`,
    })),
  };
}

export function articleJsonLd(post: PostDoc, settings: SettingsDoc) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: settings.siteName ?? siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: settings.siteName ?? siteConfig.name,
      logo: mediaUrl(settings.logo as MediaDoc | null) ?? `${siteConfig.url}${siteConfig.logoPath}`,
    },
    image: mediaUrl(post.coverImage as MediaDoc | null),
    url: `${siteConfig.url}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${post.slug}` },
  };
}

export function creativeWorkJsonLd(project: ProjectDoc, settings: SettingsDoc) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: mediaUrl(project.coverImage as MediaDoc | null),
    url: `${siteConfig.url}/portfolio/${project.slug}`,
    creator: {
      "@type": "Organization",
      name: settings.siteName ?? siteConfig.name,
    },
    ...(project.client ? { client: project.client } : {}),
    dateCreated: project.date,
  };
}
