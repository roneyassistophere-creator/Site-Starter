export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export type FooterLinkGroup = {
  heading: string
  links: NavLink[]
}

export type SocialLink = {
  platform: string
  href: string
  icon: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'youtube'
}

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  url: string
  logo: {
    text: string
    imagePath?: string
  }
  seo: {
    titleTemplate: string
    defaultTitle: string
    defaultDescription: string
    defaultOgImage: string
    twitterHandle: string
    googleVerification: string
    bingVerification: string
  }
  nav: NavLink[]
  footerLinks: FooterLinkGroup[]
  contact: {
    email: string
    phone?: string
    address?: string
  }
  social: SocialLink[]
  org: {
    legalName: string
    foundingYear: number
    areaServed: string
  }
}

const siteConfig: SiteConfig = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: 'Acme Agency',
  tagline: 'We grow your business.',
  description:
    'Acme Agency delivers world-class digital marketing, SEO, and web design for modern businesses.',
  url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',

  // ─── Logo ──────────────────────────────────────────────────────────────────
  // Set imagePath to use an image logo (e.g. '/logo.svg').
  // If imagePath is omitted the site name text is used as the logo.
  logo: {
    text: 'Acme Agency',
    // imagePath: '/logo.svg',
  },

  // ─── SEO defaults ──────────────────────────────────────────────────────────
  // These are fallbacks. Per-page overrides come from the admin → Page SEO collection.
  seo: {
    titleTemplate: '%s | Acme Agency',
    defaultTitle: 'Acme Agency — Digital Marketing & Web Design',
    defaultDescription:
      'Acme Agency delivers world-class SEO, web design, and paid advertising for modern businesses.',
    defaultOgImage: '/og-default.png',
    twitterHandle: '@acme',
    // Set these via environment variables or fill them in directly.
    googleVerification: process.env.GOOGLE_SITE_VERIFICATION ?? '',
    bingVerification: process.env.BING_SITE_VERIFICATION ?? '',
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  // ─── Footer links ──────────────────────────────────────────────────────────
  footerLinks: [
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      heading: 'Content',
      links: [{ label: 'Blog', href: '/blog' }],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ],

  // ─── Contact ───────────────────────────────────────────────────────────────
  contact: {
    email: 'hello@acme.com',
    phone: '+1 (555) 000-0000',
    address: '123 Main St, San Francisco, CA 94105',
  },

  // ─── Social ────────────────────────────────────────────────────────────────
  social: [
    { platform: 'Twitter / X', href: 'https://twitter.com/acme', icon: 'twitter' },
    { platform: 'LinkedIn', href: 'https://linkedin.com/company/acme', icon: 'linkedin' },
    { platform: 'GitHub', href: 'https://github.com/acme', icon: 'github' },
  ],

  // ─── Organization (used for JSON-LD structured data) ───────────────────────
  org: {
    legalName: 'Acme Agency LLC',
    foundingYear: 2020,
    areaServed: 'Worldwide',
  },
}

export default siteConfig
