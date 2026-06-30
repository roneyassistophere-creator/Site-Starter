import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import siteConfig from "@/config/site";
import { getPayloadClient } from "@/lib/payload";
import type { ProjectDoc, PostDoc } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/");
}

async function getHomeData() {
  try {
    const payload = await getPayloadClient();
    const [featuredProjects, recentPosts] = await Promise.all([
      payload.find({
        collection: "projects",
        where: { featured: { equals: true } },
        sort: "order",
        limit: 3,
      }),
      payload.find({
        collection: "posts",
        where: { status: { equals: "published" } },
        sort: "-publishedAt",
        limit: 3,
      }),
    ]);
    return {
      featuredProjects: featuredProjects.docs as ProjectDoc[],
      recentPosts: recentPosts.docs as PostDoc[],
    };
  } catch {
    return { featuredProjects: [], recentPosts: [] };
  }
}

export default async function HomePage() {
  const { featuredProjects, recentPosts } = await getHomeData();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-28 md:py-40">
        <div className="container mx-auto max-w-5xl px-4 text-center space-y-6">
          <Badge className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20">
            {siteConfig.tagline}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/services"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-medium text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              Our services
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-medium border bg-background hover:bg-muted"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured portfolio */}
      {featuredProjects.length > 0 && (
        <section className="py-24 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Featured work</h2>
              <Link href="/portfolio" className="text-sm font-medium text-[var(--brand-primary)] hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Latest insights</h2>
              <Link href="/blog" className="text-sm font-medium text-[var(--brand-primary)] hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function ProjectCard({ project }: { project: ProjectDoc }) {
  const cover = typeof project.coverImage === "object" ? project.coverImage : null;
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block rounded-xl overflow-hidden border bg-background hover:shadow-lg transition-shadow">
      {cover?.url ? (
        <div className="relative h-48">
          <Image src={cover.url} alt={cover.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
      )}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold group-hover:text-[var(--brand-primary)] transition-colors">{project.title}</h3>
        {project.summary && <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>}
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: PostDoc }) {
  const cover = typeof post.coverImage === "object" ? post.coverImage : null;
  return (
    <Link href={`/blog/${post.slug}`} className="group block rounded-xl overflow-hidden border bg-background hover:shadow-lg transition-shadow">
      {cover?.url ? (
        <div className="relative h-48">
          <Image src={cover.url} alt={cover.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
      )}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold group-hover:text-[var(--brand-primary)] transition-colors">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
        {post.publishedAt && (
          <p className="text-xs text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}
