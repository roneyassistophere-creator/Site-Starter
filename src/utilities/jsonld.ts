import type { SiteConfig } from '@/config/site'
import type { Post } from '@/payload-types'

// ─── Types ─────────────────────────────────────────────────────────────────
// Minimal typed wrappers — avoids a heavy schema.org dependency.

type WithContext<T> = T & { '@context': 'https://schema.org'; '@type': string }

type OrgSchema = WithContext<{
  name: string
  url: string
  logo?: string
  description?: string
  foundingDate?: string
  legalName?: string
  contactPoint?: { '@type': 'ContactPoint'; email?: string; telephone?: string }
  sameAs?: string[]
}>

type WebSiteSchema = WithContext<{
  name: string
  url: string
  description?: string
  potentialAction?: {
    '@type': 'SearchAction'
    target: { '@type': 'EntryPoint'; urlTemplate: string }
    'query-input': string
  }
}>

type WebPageSchema = WithContext<{
  name: string
  description?: string
  url: string
  image?: string
  isPartOf?: { '@type': 'WebSite'; url: string }
  breadcrumb?: object
}>

type ArticleSchema = WithContext<{
  headline: string
  description?: string
  image?: string
  url: string
  datePublished?: string
  dateModified?: string
  author?: { '@type': 'Person'; name: string }
  publisher?: { '@type': 'Organization'; name: string; logo?: object }
}>

type BreadcrumbSchema = WithContext<{
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}>

// ─── Schemas ───────────────────────────────────────────────────────────────

export function organizationSchema(config: SiteConfig): OrgSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    legalName: config.org.legalName || config.name,
    url: config.url,
    description: config.description,
    foundingDate: String(config.org.foundingYear),
    contactPoint: {
      '@type': 'ContactPoint',
      email: config.contact.email,
      telephone: config.contact.phone,
    },
    sameAs: config.social.map((s) => s.href).filter(Boolean),
  }
}

export function websiteSchema(config: SiteConfig): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    description: config.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function webPageSchema(args: {
  title: string
  description?: string
  url: string
  image?: string
  siteUrl: string
}): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: args.title,
    description: args.description,
    url: args.url,
    image: args.image,
    isPartOf: { '@type': 'WebSite', url: args.siteUrl },
  }
}

export function servicePageSchema(args: {
  name: string
  description?: string
  url: string
  providerName: string
  siteUrl: string
}): WithContext<object> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description,
    url: args.url,
    provider: {
      '@type': 'Organization',
      name: args.providerName,
      url: args.siteUrl,
    },
  }
}

export function articleSchema(args: {
  post: Partial<Post>
  authorName?: string
  imageUrl?: string
  siteUrl: string
  siteName: string
}): ArticleSchema {
  const { post, authorName, imageUrl, siteUrl, siteName } = args
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title ?? '',
    description: post.meta?.description ?? undefined,
    image: imageUrl,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.createdAt ?? undefined,
    dateModified: post.updatedAt ?? undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
  }
}

export function breadcrumbSchema(items: { name: string; href: string }[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  }
}

// Convenience: serialize to the string used in <script> tags
export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema)
}
