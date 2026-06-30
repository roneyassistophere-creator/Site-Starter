import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getPayloadClient } from "@/lib/payload";
import type { ProjectDoc, MediaDoc } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/portfolio");
}

export const revalidate = 60;

async function getProjects(): Promise<ProjectDoc[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "projects",
      sort: "order",
      limit: 100,
    });
    return docs as ProjectDoc[];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="container mx-auto max-w-6xl px-4 py-24 space-y-14">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground text-lg">A selection of our work and case studies.</p>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const cover = typeof project.coverImage === "object" ? (project.coverImage as MediaDoc) : null;
              return (
                <article key={project.id}>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group block rounded-xl overflow-hidden border bg-background hover:shadow-lg transition-shadow"
                  >
                    {cover?.url ? (
                      <div className="relative h-52">
                        <Image
                          src={cover.url}
                          alt={cover.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-52 bg-muted" />
                    )}
                    <div className="p-5 space-y-2">
                      {project.featured && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                              style={{ background: "var(--brand-accent)" }}>
                          Featured
                        </span>
                      )}
                      <h2 className="font-bold text-lg leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                        {project.title}
                      </h2>
                      {project.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{project.summary}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {project.client && <span>{project.client}</span>}
                        {project.category && <span>{project.category}</span>}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
