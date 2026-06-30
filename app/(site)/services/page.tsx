import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/services");
}

const services = [
  { title: "SEO Optimisation", description: "Dominate search results with keyword research, on-page, and link-building strategies.", price: "From $799/mo" },
  { title: "Web Design & Dev", description: "Lightning-fast, accessible, conversion-focused websites built with Next.js.", price: "From $2,499" },
  { title: "Paid Advertising", description: "Google & Meta campaigns that maximise ROAS and deliver measurable pipeline growth.", price: "From $999/mo" },
  { title: "Content Strategy", description: "Blog posts, case studies, and social content crafted to rank, engage, and convert.", price: "From $599/mo" },
];

export default function ServicesPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="container mx-auto max-w-5xl px-4 py-24 space-y-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Everything you need to grow online — under one roof.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border bg-background p-6 space-y-3 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              <p className="text-sm font-semibold text-[var(--brand-primary)]">{s.price}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
