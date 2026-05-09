import blogIndex from "../../data/blog-index.json";

type Post = {
  slug: string;
  href: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogList({
  title,
  count,
  layout,
  showImage,
  showDate,
  showExcerpt,
}: {
  title: string;
  count: number;
  layout: "grid" | "list";
  showImage: boolean;
  showDate: boolean;
  showExcerpt: boolean;
}) {
  const posts: Post[] = ((blogIndex as { posts: Post[] }).posts || []).slice(
    0,
    Math.max(1, count || 6)
  );

  if (posts.length === 0) {
    return (
      <section className="section-padding">
        <div className="max-w-5xl mx-auto text-center text-[var(--color-text-light)]">
          {title && (
            <h2 className="text-3xl font-bold font-heading mb-4 text-[var(--color-text)]">
              {title}
            </h2>
          )}
          <p>Noch keine Beiträge.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-10 text-[var(--color-text)]">
            {title}
          </h2>
        )}

        {layout === "list" ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-[var(--color-border)] pb-8 last:border-b-0">
                <a href={post.href} className="block group">
                  {showDate && post.date && (
                    <p className="text-xs uppercase tracking-wider text-[var(--color-text-light)] mb-1">
                      {formatDate(post.date)}
                    </p>
                  )}
                  <h3 className="text-2xl font-heading text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  {showExcerpt && post.description && (
                    <p className="mt-2 text-[var(--color-text-light)] line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-sm text-[var(--color-primary)] group-hover:underline">
                    Weiterlesen →
                  </span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <a href={post.href} className="block group">
                  {showImage && post.image && (
                    <div className="aspect-[16/10] overflow-hidden bg-[var(--color-border)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {showDate && post.date && (
                      <p className="text-xs uppercase tracking-wider text-[var(--color-text-light)] mb-2">
                        {formatDate(post.date)}
                      </p>
                    )}
                    <h3 className="text-xl font-heading text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {post.title}
                    </h3>
                    {showExcerpt && post.description && (
                      <p className="mt-2 text-sm text-[var(--color-text-light)] line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    <span className="mt-4 inline-block text-sm text-[var(--color-primary)] group-hover:underline">
                      Weiterlesen →
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
