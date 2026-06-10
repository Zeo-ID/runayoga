export function Gallery({
  title,
  columns = 3,
  images,
}: {
  title: string;
  columns: number;
  images: { src: string; alt: string; caption: string }[];
}) {
  const cols = columns === 2 ? 2 : columns === 4 ? 4 : 3;
  const colClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-2 lg:grid-cols-3";

  const list = images || [];

  /* Alternate organic radii so the grid feels hand-placed, not stamped out. */
  const radii = [
    "52% 48% 47% 53% / 58% 54% 46% 42%",
    "47% 53% 54% 46% / 44% 49% 51% 56%",
    "55% 45% 42% 58% / 52% 56% 44% 48%",
    "44% 56% 51% 49% / 57% 45% 55% 43%",
  ];
  /* Gentle vertical offset for an editorial, asymmetric rhythm (desktop only). */
  const lift = (i: number) => (i % 2 === 0 ? 0 : 28);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Soft warm blobs for depth */}
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 380, height: 380, background: "rgba(217,169,143,.20)", top: -130, right: -110 }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 300, height: 300, background: "rgba(63,69,52,.08)", bottom: -120, left: -90 }}
      />

      <div className="container relative z-10">
        {/* Editorial header */}
        {title && (
          <header style={{ maxWidth: 720, marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <span className="kicker">✦ Galerie</span>
            <h2 className="display-sm" style={{ marginTop: "1.1rem" }}>
              {title}
            </h2>
            <div className="hairline" style={{ marginTop: "1.8rem", maxWidth: 120 }} />
          </header>
        )}

        {list.length > 0 ? (
          <div
            className={`ry-gallery-grid grid grid-cols-1 ${colClass}`}
            style={{ gap: "clamp(1.4rem, 3vw, 2.4rem)", alignItems: "start" }}
          >
            {list.map((img, i) => (
              <figure
                key={i}
                className="ry-gallery-item group relative"
                style={{ marginTop: `var(--ry-lift, ${lift(i)}px)` }}
              >
                {/* Offset terracotta frame revealed on hover */}
                <span
                  aria-hidden="true"
                  className="ry-frame"
                  style={{ borderRadius: radii[i % radii.length] }}
                />

                <div
                  className="ry-img-wrap relative overflow-hidden"
                  style={{
                    borderRadius: radii[i % radii.length],
                    aspectRatio: "4 / 5",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    loading="lazy"
                    className="ry-img w-full h-full"
                    style={{ objectFit: "cover", display: "block" }}
                  />
                  {/* Index numeral, editorial signature */}
                  <span
                    aria-hidden="true"
                    className="ry-num"
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 18,
                      fontFamily: "Fraunces, serif",
                      fontStyle: "italic",
                      fontSize: "1.05rem",
                      color: "#fff",
                      mixBlendMode: "difference",
                      opacity: 0.85,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {img.caption && (
                  <figcaption
                    className="ry-caption"
                    style={{
                      marginTop: "1rem",
                      fontFamily: "Fraunces, serif",
                      fontStyle: "italic",
                      fontSize: "1.02rem",
                      lineHeight: 1.4,
                      color: "var(--color-text-light)",
                      paddingLeft: "1.1rem",
                      borderLeft: "2px solid var(--color-rose-soft)",
                    }}
                  >
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div
            className="organic-img-soft bg-alt"
            style={{
              padding: "clamp(3rem, 7vw, 5rem) 2rem",
              textAlign: "center",
              border: "1.5px dashed var(--color-border)",
              background: "linear-gradient(150deg, var(--color-rose-soft), var(--color-bg-alt))",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "Fraunces, serif",
                fontStyle: "italic",
                fontSize: "3.2rem",
                color: "var(--color-primary)",
                opacity: 0.45,
                display: "block",
                marginBottom: ".4rem",
              }}
            >
              ✺
            </span>
            <p style={{ color: "var(--color-text-light)", fontSize: "1.05rem" }}>
              Noch keine Bilder hinzugefügt.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .ry-gallery-item .ry-frame {
          position: absolute;
          inset: 0;
          transform: translate(14px, 14px);
          border: 1.5px solid var(--color-primary);
          opacity: 0;
          transition: opacity var(--transition), transform var(--transition);
          pointer-events: none;
          z-index: 0;
        }
        .ry-gallery-item .ry-img-wrap {
          transition: transform var(--transition), box-shadow var(--transition);
          z-index: 1;
        }
        .ry-gallery-item .ry-img {
          transition: transform .6s cubic-bezier(.2,.7,.2,1), filter var(--transition);
        }
        .ry-gallery-item:hover .ry-frame {
          opacity: .55;
          transform: translate(18px, 18px);
        }
        .ry-gallery-item:hover .ry-img-wrap {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }
        .ry-gallery-item:hover .ry-img {
          transform: scale(1.07);
        }
        .ry-gallery-item .ry-caption {
          transition: color var(--transition), border-color var(--transition);
        }
        .ry-gallery-item:hover .ry-caption {
          color: var(--color-text);
          border-color: var(--color-primary);
        }
        @media (max-width: 768px) {
          .ry-gallery-item { margin-top: 0 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ry-gallery-item .ry-img,
          .ry-gallery-item .ry-img-wrap,
          .ry-gallery-item .ry-frame { transition: none !important; }
          .ry-gallery-item:hover .ry-img { transform: none; }
          .ry-gallery-item:hover .ry-img-wrap { transform: none; }
        }
      `}</style>
    </section>
  );
}
