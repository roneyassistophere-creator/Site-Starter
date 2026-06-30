// Minimal hand-written interfaces for Payload documents.
// These are replaced by the auto-generated payload-types.ts once
// `payload generate:types` (or the dev server first compile) produces it.

export type MediaDoc = {
  id: string;
  alt: string;
  url?: string;
  filename?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number };
    card?: { url?: string; width?: number; height?: number };
    hero?: { url?: string; width?: number; height?: number };
    og?: { url?: string; width?: number; height?: number };
  };
};

export type PageMetaDoc = {
  id: string;
  path: string;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: MediaDoc | string | null;
  noindex?: boolean;
};

export type PostDoc = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: MediaDoc | string | null;
  content?: Record<string, unknown>;
  categories?: { category: string }[];
  tags?: { tag: string }[];
  author?: string;
  publishedAt?: string;
  status: "draft" | "published";
  meta?: {
    title?: string;
    description?: string;
    image?: MediaDoc | string | null;
  };
};

export type ProjectDoc = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: MediaDoc | string | null;
  gallery?: { image: MediaDoc | string; caption?: string }[];
  content?: Record<string, unknown>;
  category?: string;
  tags?: { tag: string }[];
  client?: string;
  date?: string;
  featured?: boolean;
  order?: number;
  meta?: {
    title?: string;
    description?: string;
    image?: MediaDoc | string | null;
  };
};

export type SettingsDoc = {
  siteName?: string;
  logo?: MediaDoc | string | null;
  seo?: {
    titleTemplate?: string;
    defaultDescription?: string;
    defaultOgImage?: MediaDoc | string | null;
  };
  organization?: {
    name?: string;
    url?: string;
    email?: string;
    phone?: string;
    address?: {
      streetAddress?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
    };
    socialProfiles?: { url: string }[];
  };
};

export type IntegrationsDoc = {
  ga4MeasurementId?: string;
  googleSiteVerification?: string;
  extraVerificationTags?: { name: string; content: string }[];
};
