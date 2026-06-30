import type { Metadata } from "next";
import { getPayloadClient } from "./payload";
import siteConfig from "@/config/site";
import type { PageMetaDoc, MediaDoc, SettingsDoc } from "./types";

function mediaUrl(media: MediaDoc | string | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  return media.sizes?.og?.url ?? media.url ?? undefined;
}

// Fetch the CMS Settings global once per request (cached by Next.js fetch).
export async function getSettings(): Promise<SettingsDoc> {
  try {
    const payload = await getPayloadClient();
    return (await payload.findGlobal({ slug: "settings" })) as SettingsDoc;
  } catch {
    return {};
  }
}

// Build Next.js Metadata for a static code page, merging CMS overrides onto code fallbacks.
export async function buildPageMetadata(path: string): Promise<Metadata> {
  let cmsMeta: PageMetaDoc | null = null;
  let settings: SettingsDoc = {};

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "page-meta",
      where: { path: { equals: path } },
      limit: 1,
    });
    cmsMeta = (result.docs[0] as PageMetaDoc) ?? null;
    settings = (await payload.findGlobal({ slug: "settings" })) as SettingsDoc;
  } catch {
    // Payload not available (build time race) — fall through to code defaults.
  }

  const siteUrl = siteConfig.url;
  const titleTemplate =
    settings.seo?.titleTemplate ?? siteConfig.seo.titleTemplate;
  const defaultDesc =
    settings.seo?.defaultDescription ?? siteConfig.seo.defaultDescription;
  const defaultOg =
    mediaUrl(settings.seo?.defaultOgImage) ?? siteConfig.seo.defaultOgImage;

  const title = cmsMeta?.title ?? undefined;
  const description = cmsMeta?.description ?? defaultDesc;
  const canonical = cmsMeta?.canonical ?? `${siteUrl}${path}`;
  const ogImageUrl = mediaUrl(cmsMeta?.ogImage as MediaDoc | null) ?? defaultOg;
  const noindex = cmsMeta?.noindex ?? false;

  return {
    title: title ?? siteConfig.seo.defaultTitle,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title: title ?? siteConfig.seo.defaultTitle,
      description,
      siteName: settings.siteName ?? siteConfig.name,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.seo.defaultTitle,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
      ...(siteConfig.seo.twitterHandle
        ? { creator: siteConfig.seo.twitterHandle }
        : {}),
    },
  };
}

// Build metadata for a blog post.
export function buildPostMetadata(
  post: import("./types").PostDoc,
  settings: SettingsDoc
): Metadata {
  const siteUrl = siteConfig.url;
  const title = post.meta?.title ?? post.title;
  const description =
    post.meta?.description ??
    post.excerpt ??
    settings.seo?.defaultDescription ??
    siteConfig.seo.defaultDescription;
  const ogUrl = `${siteUrl}/blog/${post.slug}`;
  const coverUrl =
    mediaUrl(post.meta?.image as MediaDoc | null) ??
    mediaUrl(post.coverImage as MediaDoc | null) ??
    settings.seo?.defaultOgImage
      ? mediaUrl(settings.seo?.defaultOgImage as MediaDoc | null)
      : siteConfig.seo.defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical: ogUrl },
    openGraph: {
      type: "article",
      url: ogUrl,
      title,
      description,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

// Build metadata for a portfolio project.
export function buildProjectMetadata(
  project: import("./types").ProjectDoc,
  settings: SettingsDoc
): Metadata {
  const siteUrl = siteConfig.url;
  const title = project.meta?.title ?? project.title;
  const description =
    project.meta?.description ??
    project.summary ??
    settings.seo?.defaultDescription ??
    siteConfig.seo.defaultDescription;
  const ogUrl = `${siteUrl}/portfolio/${project.slug}`;
  const coverUrl =
    mediaUrl(project.meta?.image as MediaDoc | null) ??
    mediaUrl(project.coverImage as MediaDoc | null) ??
    siteConfig.seo.defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical: ogUrl },
    openGraph: {
      type: "website",
      url: ogUrl,
      title,
      description,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}
