import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getPayloadClient } from "@/lib/payload";
import type { PostDoc } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/blog");
}

// Revalidate every 60 s so newly published posts appear quickly.
export const revalidate = 60;

async function getPosts(page = 1): Promise<{ docs: PostDoc[]; totalPages: number; page: number }> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 9,
      page,
    });
    return {
      docs: result.docs as PostDoc[],
      totalPages: result.totalPages,
      page: result.page ?? 1,
    };
  } catch {
    return { docs: [], totalPages: 1, page: 1 };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam ?? 1);
  const { docs: posts, totalPages } = await getPosts(currentPage);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="container mx-auto max-w-6xl px-4 py-24 space-y-14">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Blog</h1>
          <p className="text-muted-foreground text-lg">Insights, tips, and news.</p>
          <Link href="/blog/rss.xml" className="text-xs text-muted-foreground hover:text-[var(--brand-primary)] underline underline-offset-4">
            RSS feed
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const cover = typeof post.coverImage === "object" ? post.coverImage : null;
              return (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block rounded-xl overflow-hidden border bg-background hover:shadow-lg transition-shadow">
                    {cover?.url ? (
                      <div className="relative h-48">
                        <Image src={cover.url} alt={cover.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="h-48 bg-muted" />
                    )}
                    <div className="p-5 space-y-2">
                      <h2 className="font-bold text-lg leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        {post.author && <span>{post.author}</span>}
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </time>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="flex gap-2 justify-center flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                  p === currentPage
                    ? "bg-[var(--brand-primary)] text-white border-transparent"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </main>
    </>
  );
}
