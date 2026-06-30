import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import siteConfig from "@/config/site";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
import { getPayloadClient } from "@/lib/payload";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import type { SettingsDoc, IntegrationsDoc } from "@/lib/types";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.keywords,
};

async function getSiteData(): Promise<{ settings: SettingsDoc; integrations: IntegrationsDoc }> {
  try {
    const payload = await getPayloadClient();
    const [settings, integrations] = await Promise.all([
      payload.findGlobal({ slug: "settings" }),
      payload.findGlobal({ slug: "integrations" }),
    ]);
    return {
      settings: settings as SettingsDoc,
      integrations: integrations as IntegrationsDoc,
    };
  } catch {
    return { settings: {}, integrations: {} };
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, integrations } = await getSiteData();

  const orgLd = organizationJsonLd(settings);
  const webLd = websiteJsonLd(settings);

  return (
    <>
      {/* Site-wide JSON-LD scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webLd) }}
      />

      {/* Google Search Console verification — injected only when set in CMS */}
      {integrations.googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={integrations.googleSiteVerification}
        />
      )}

      {/* Extra verification tags (Bing, Yandex, etc.) */}
      {integrations.extraVerificationTags?.map((tag) => (
        <meta key={tag.name} name={tag.name} content={tag.content} />
      ))}

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        style={
          {
            "--brand-primary": siteConfig.colors.primary,
            "--brand-accent": siteConfig.colors.accent,
          } as React.CSSProperties
        }
      >
        {/* Header */}
        <header className="w-full border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div>
                <div className="font-heading font-semibold">{siteConfig.name}</div>
                <div className="text-xs text-muted-foreground">{siteConfig.tagline}</div>
              </div>
            </Link>
            <nav>
              <ul className="flex items-center gap-4 text-sm">
                {siteConfig.navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="w-full border-t bg-card/50">
          <div className="container mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="font-heading font-semibold">{siteConfig.name}</div>
              <div className="text-sm text-muted-foreground mt-2">{siteConfig.description}</div>
            </div>
            {siteConfig.footerLinks.map((group) => (
              <div key={group.heading}>
                <div className="font-medium">{group.heading}</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* GA4 — injected only when Measurement ID is set in CMS Integrations */}
      {integrations.ga4MeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${integrations.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.ga4MeasurementId}');`}
          </Script>
        </>
      )}
    </>
  );
}
