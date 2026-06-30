import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import siteConfig from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/contact");
}

export default function ContactPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="container mx-auto max-w-2xl px-4 py-24 space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">Get in touch</h1>
          <p className="text-muted-foreground text-lg">
            Reach us directly — no form backend, no CRM.
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          <li>
            <span className="font-medium">Email: </span>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--brand-primary)] underline underline-offset-4">
              {siteConfig.contact.email}
            </a>
          </li>
          {siteConfig.contact.phone && (
            <li><span className="font-medium">Phone: </span>{siteConfig.contact.phone}</li>
          )}
          {siteConfig.contact.address && (
            <li><span className="font-medium">Address: </span>{siteConfig.contact.address}</li>
          )}
        </ul>
      </main>
    </>
  );
}
