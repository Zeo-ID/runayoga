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

  /* ─────────── Empty state ─────────── */
  if (posts.length === 0) {
    return (
      <section className="section-padding relative overflow-hidden">
        <div
          className="blob"
          aria-hidden="true"
          style={{ width: 340, height: 340, background: "rgba(217,169,143,.22)", top: -110, right: -80 }}
        />
        <div className="container relative z-10" style={{ textAlign: "center", maxWidth: 640 }}>
          <span className="kicker" style={{ justifyContent: "center" }}>
            ✦ Journal
          </span>
          {title && (
            <h2 className="display-sm" style={{ marginTop: "1.2rem" }}>
              {title}
            </h2>
          )}
          <p style={{ marginTop: "1.4rem", color: "var(--color-text-light)", fontSize: "1.08rem" }}>
            Noch keine Beiträge —{" "}
            <span className="serif-italic" style={{ color: "var(--color-primary)" }}>
              bald mehr aus dem Studio.
            </span>
          </p>
        </div>
      </section>
    );
  }

  /* ─────────── Editorial header (shared) ─────────── */
  const header = (
    <div
      className="flex flex-wrap items-end justify-between gap-6"
      style={{ marginBottom: "clamp(2.6rem, 5vw, 3.8rem)" }}
    >
      <div style={{ maxWidth: 620 }}>
        <span className="kicker">✦ Journal</span>
        {title && (
          <h2 className="display-sm" style={{ marginTop: "1.1rem" }}>
            {title}
          </h2>
        )}
      </div>
      <span
        className="serif-italic"
        aria-hidden="true"
        style={{
          fontSize: "1.05rem",
          color: "var(--color-text-muted)",
          paddingBottom: ".35rem",
          whiteSpace: "nowrap",
        }}
      >
        {posts.length} {posts.length === 1 ? "Beitrag" : "Beiträge"}
      </span>
    </div>
  );

  return (
    <section className="section-padding relative overflow-hidden">
      {/* soft decorative blob */}
      <div
        className="blob"
        aria-hidden="true"
        style={{
          width: 460,
          height: 460,
          background: "rgba(191,106,74,.08)",
          top: -160,
          left: -120,
        }}
      />

      <div className="container relative z-10">
        {(title || true) && header}

        {layout === "list" ? (
          /* ─────────── LIST: editorial index rows ─────────── */
          <div className="bloglist-rows" style={{ maxWidth: 920 }}>
            {posts.map((post, i) => (
              <article key={post.slug} className="bloglist-row">
                <a
                  href={post.href}
                  className="bloglist-row-link group"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "clamp(1rem, 3vw, 2.4rem)",
                    alignItems: "start",
                    textDecoration: "none",
                  }}
                >
                  <span
                    className="index-num"
                    aria-hidden="true"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1, paddingTop: ".15rem" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    {showDate && post.date && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: ".72rem",
                          letterSpacing: ".22em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          marginBottom: ".5rem",
                        }}
                      >
                        {formatDate(post.date)}
                      </p>
                    )}
                    <h3
                      className="bloglist-row-title font-heading"
                      style={{
                        fontSize: "clamp(1.45rem, 2.6vw, 2rem)",
                        fontWeight: 500,
                        lineHeight: 1.12,
                        letterSpacing: "-.015em",
                        color: "var(--color-text)",
                      }}
                    >
                      {post.title}
                    </h3>
                    {showExcerpt && post.description && (
                      <p
                        className="line-clamp-2"
                        style={{ marginTop: ".7rem", color: "var(--color-text-light)", lineHeight: 1.65, maxWidth: 620 }}
                      >
                        {post.description}
                      </p>
                    )}
                    <span className="link-arrow" style={{ marginTop: "1rem" }}>
                      Weiterlesen <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          /* ─────────── GRID: organic editorial cards ─────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            {posts.map((post, i) => (
              <article key={post.slug} className="bloglist-card">
                <a
                  href={post.href}
                  className="group"
                  style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none" }}
                >
                  {showImage && post.image ? (
                    <div className="bloglist-card-media organic-img-soft relative" style={{ aspectRatio: "4/3" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="bloglist-card-img"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                      <span className="bloglist-card-index serif-italic" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ) : (
                    !showImage ? null : (
                      <div
                        className="organic-img-soft relative"
                        aria-hidden="true"
                        style={{
                          aspectRatio: "4/3",
                          background: "linear-gradient(150deg, var(--color-rose-soft), var(--color-bg-alt))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "3rem", color: "var(--color-primary)", opacity: 0.4 }}>
                          ✺
                        </span>
                      </div>
                    )
                  )}

                  <div
                    className="bloglist-card-body"
                    style={{ paddingTop: showImage && post.image ? "1.4rem" : "1.4rem", flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    {showDate && post.date && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: ".7rem",
                          letterSpacing: ".22em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          marginBottom: ".55rem",
                        }}
                      >
                        {formatDate(post.date)}
                      </p>
                    )}
                    <h3
                      className="bloglist-card-title font-heading"
                      style={{
                        fontSize: "1.45rem",
                        fontWeight: 500,
                        lineHeight: 1.16,
                        letterSpacing: "-.012em",
                        color: "var(--color-text)",
                      }}
                    >
                      {post.title}
                    </h3>
                    {showExcerpt && post.description && (
                      <p
                        className="line-clamp-3"
                        style={{ marginTop: ".65rem", fontSize: ".96rem", color: "var(--color-text-light)", lineHeight: 1.6 }}
                      >
                        {post.description}
                      </p>
                    )}
                    <span className="link-arrow" style={{ marginTop: "auto", paddingTop: "1.1rem" }}>
                      Weiterlesen <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* List rows — hairline-separated editorial index */
        .bloglist-rows { display: flex; flex-direction: column; }
        .bloglist-row {
          border-top: 1px solid var(--color-border);
          padding: clamp(1.6rem, 3vw, 2.4rem) 0;
        }
        .bloglist-row:last-child { border-bottom: 1px solid var(--color-border); }
        .bloglist-row-link .index-num,
        .bloglist-row-link .bloglist-row-title {
          transition: color var(--transition), opacity var(--transition);
        }
        .bloglist-row-link:hover .bloglist-row-title { color: var(--color-primary); }
        .bloglist-row-link:hover .index-num { opacity: .9; }

        /* Grid cards — organic, warm, lift on hover */
        .bloglist-card {
          background: var(--color-bg-cream);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: clamp(.9rem, 1.6vw, 1.1rem);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
          will-change: transform;
        }
        .bloglist-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-rose);
        }
        .bloglist-card-media { overflow: hidden; }
        .bloglist-card-img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
        .bloglist-card:hover .bloglist-card-img { transform: scale(1.06); }
        .bloglist-card-index {
          position: absolute;
          left: .9rem;
          bottom: .65rem;
          font-size: 1.5rem;
          color: #fff;
          text-shadow: 0 2px 10px rgba(43,38,34,.45);
          z-index: 2;
        }
        .bloglist-card-body { padding-left: .5rem; padding-right: .5rem; padding-bottom: .65rem; }
        .bloglist-card-title { transition: color var(--transition); }
        .bloglist-card:hover .bloglist-card-title { color: var(--color-primary); }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .bloglist-row-link { grid-template-columns: 1fr !important; gap: .4rem !important; }
          .bloglist-row-link .index-num { font-size: 1.2rem !important; }
        }
      `}</style>
    </section>
  );
}
