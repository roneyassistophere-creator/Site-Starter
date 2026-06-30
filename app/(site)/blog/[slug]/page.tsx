import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { getSettings, buildPostMetadata } from "@/lib/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { PostDoc, MediaDoc } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      limit: 1000,
      select: { slug: true },
    });
    return docs.map((d) => ({ slug: (d as PostDoc).slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug }, status: { equals: "published" } },
      limit: 1,
    });
    if (!docs[0]) return { title: "Post not found" };
    const settings = await getSettings();
    return buildPostMetadata(docs[0] as PostDoc, settings);
  } catch {
    return { title: slug };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post: PostDoc | null = null;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug }, status: { equals: "published" } },
      limit: 1,
    });
    post = (docs[0] as PostDoc) ?? null;
  } catch {
    notFound();
  }

  if (!post) notFound();

  const settings = await getSettings();
  const cover = typeof post.coverImage === "object" ? (post.coverImage as MediaDoc) : null;

  const articleLd = articleJsonLd(post, settings);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main className="container mx-auto max-w-3xl px-4 py-24">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-8 flex gap-2">
          <Link href="/" className="hover:text-[var(--brand-primary)]">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--brand-primary)]">Blog</Link>
          <span>/</span>
          <span className="text-foreground truncate">{post.title}</span>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.author && <span>By {post.author}</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </time>
              )}
            </div>
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.categories.map((c) => (
                  <span key={c.category} className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-muted">
                    {c.category}
                  </span>
                ))}
              </div>
            )}
          </header>

          {cover?.url && (
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image src={cover.url} alt={cover.alt} fill className="object-cover" priority />
            </div>
          )}

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed border-l-4 pl-4"
               style={{ borderColor: "var(--brand-primary)" }}>
              {post.excerpt}
            </p>
          )}

          {post.content && (
            <div className="prose prose-neutral max-w-none">
              <RichText data={post.content as unknown as Parameters<typeof RichText>[0]["data"]} />
            </div>
          )}
        </article>
      </main>
    </>
  );
}
