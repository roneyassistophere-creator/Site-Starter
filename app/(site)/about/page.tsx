import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import siteConfig from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/about");
}

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="container mx-auto max-w-4xl px-4 py-24 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About {siteConfig.name}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            We combine creative strategy with rigorous analytics to deliver measurable results.
          </p>
        </div>
        <div className="prose prose-neutral max-w-none">
          <p>
            Since our founding, {siteConfig.name} has helped businesses transform their online presence.
            Edit this page content in code — it&apos;s intentionally kept in source for fast, static rendering.
          </p>
          <p>
            Per-page SEO (title, description, OG image) is editable in the CMS under{" "}
            <strong>SEO → Page Meta → /about</strong>.
          </p>
        </div>
      </main>
    </>
  );
}
