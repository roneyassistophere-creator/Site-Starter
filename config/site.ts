// ─── Brand + Navigation config ───────────────────────────────────────────────
// Edit this file to re-skin the site. All pages and components read from here.
// CMS (Payload) manages per-page SEO, blog posts, and portfolio projects only.

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  heading: string;
  links: NavLink[];
};

export type SocialLink = {
  platform: string;
  href: string;
  icon: string;
};

export type SiteConfig = {
  // Identity
  name: string;
  tagline: string;
  description: string;
  url: string;
  logoPath: string;

  // Brand colors (injected as CSS variables via site layout)
  colors: {
    primary: string;
    accent: string;
  };

  // Navigation — each item becomes its own page route
  navLinks: NavLink[];
  footerLinks: FooterLinkGroup[];
  socialLinks: SocialLink[];

  // Contact
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };

  // Fallback SEO (used when PageMeta record is absent in CMS)
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultOgImage: string;
    keywords: string[];
    twitterHandle?: string;
  };
};

const siteConfig: SiteConfig = {
  name: "Acme Agency",
  tagline: "We grow your business.",
  description:
    "Acme Agency delivers world-class digital marketing, SEO, and web design for modern businesses.",
  url: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  logoPath: "/images/logo.svg",

  colors: {
    primary: "#6d28d9",
    accent: "#f59e0b",
  },

  // ─── Nav links map 1:1 to page routes ─────────────────────────────────────
  navLinks: [
    { label: "Home",      href: "/" },
    { label: "About",     href: "/about" },
    { label: "Services",  href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog",      href: "/blog" },
    { label: "Contact",   href: "/contact" },
  ],

  footerLinks: [
    {
      heading: "Company",
      links: [
        { label: "About",    href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact",  href: "/contact" },
      ],
    },
    {
      heading: "Content",
      links: [
        { label: "Blog",      href: "/blog" },
        { label: "Portfolio", href: "/portfolio" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy",   href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],

  socialLinks: [
    { platform: "Twitter / X", href: "https://twitter.com/acme",           icon: "x" },
    { platform: "LinkedIn",    href: "https://linkedin.com/company/acme",  icon: "linkedin" },
    { platform: "GitHub",      href: "https://github.com/acme",            icon: "github" },
  ],

  contact: {
    email: "hello@acme.com",
    phone: "+1 (555) 000-0000",
    address: "123 Main St, San Francisco, CA 94105",
  },

  // Code fallbacks — overridden per-page by the PageMeta CMS collection
  seo: {
    titleTemplate: "%s | Acme Agency",
    defaultTitle: "Acme Agency — Digital Marketing & Web Design",
    defaultDescription:
      "Acme Agency delivers world-class SEO, web design, and paid advertising for modern businesses.",
    defaultOgImage: "/images/og-default.png",
    keywords: [
      "digital marketing agency",
      "SEO services",
      "web design",
      "paid advertising",
    ],
    twitterHandle: "@acme",
  },
};

export default siteConfig;
