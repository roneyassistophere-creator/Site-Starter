import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { getSettings, buildProjectMetadata } from "@/lib/metadata";
import { creativeWorkJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { ProjectDoc, MediaDoc } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "projects",
      limit: 1000,
      select: { slug: true },
    });
    return docs.map((d) => ({ slug: (d as ProjectDoc).slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (!docs[0]) return { title: "Project not found" };
    const settings = await getSettings();
    return buildProjectMetadata(docs[0] as ProjectDoc, settings);
  } catch {
    return { title: slug };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project: ProjectDoc | null = null;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    project = (docs[0] as ProjectDoc) ?? null;
  } catch {
    notFound();
  }

  if (!project) notFound();

  const settings = await getSettings();
  const cover = typeof project.coverImage === "object" ? (project.coverImage as MediaDoc) : null;

  const cwLd = creativeWorkJsonLd(project, settings);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: project.title, href: `/portfolio/${project.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cwLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main className="container mx-auto max-w-4xl px-4 py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-8 flex gap-2">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Home</Link>
          <span>/</span>
          <Link href="/portfolio" className="hover:text-[var(--brand-primary)]">Portfolio</Link>
          <span>/</span>
          <span className="text-foreground truncate">{project.title}</span>
        </nav>

        <article className="space-y-10">
          <header className="space-y-4">
            {project.featured && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                    style={{ background: "var(--brand-accent)" }}>
                Featured
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {project.title}
            </h1>
            <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
              {project.client && <span><strong>Client:</strong> {project.client}</span>}
              {project.category && <span><strong>Category:</strong> {project.category}</span>}
              {project.date && (
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </span>
              )}
            </div>
          </header>

          {cover?.url && (
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image src={cover.url} alt={cover.alt} fill className="object-cover" priority />
            </div>
          )}

          {project.summary && (
            <p className="text-xl text-muted-foreground leading-relaxed border-l-4 pl-4"
               style={{ borderColor: "var(--brand-primary)" }}>
              {project.summary}
            </p>
          )}

          {project.content && (
            <div className="prose prose-neutral max-w-none">
              <RichText data={project.content as unknown as Parameters<typeof RichText>[0]["data"]} />
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.gallery.map((item, i) => {
                  const img = typeof item.image === "object" ? (item.image as MediaDoc) : null;
                  return img?.url ? (
                    <figure key={i} className="space-y-1">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={img.url} alt={img.alt} fill className="object-cover" />
                      </div>
                      {item.caption && (
                        <figcaption className="text-xs text-muted-foreground">{item.caption}</figcaption>
                      )}
                    </figure>
                  ) : null;
                })}
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
