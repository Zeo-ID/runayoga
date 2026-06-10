export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { text: string; name: string; rating: number }[];
}) {
  const list = items || [];

  return (
    <section className="section-padding relative overflow-hidden bg-alt">
      {/* organic warm blobs */}
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 380, height: 380, background: "rgba(217,169,143,.26)", top: -130, right: -110 }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 320, height: 320, background: "rgba(191,106,74,.12)", bottom: -120, left: -90 }}
      />

      <div className="container relative z-10">
        {/* Editorial header — asymmetric */}
        <div
          className="grid items-end"
          style={{ gridTemplateColumns: "1fr auto", gap: "2rem", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div style={{ maxWidth: 620 }}>
            <span className="kicker">✦ Stimmen</span>
            {title && (
              <h2 className="display-sm" style={{ marginTop: "1.2rem" }}>
                {title}
              </h2>
            )}
          </div>
          <span
            className="index-num"
            aria-hidden="true"
            style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1, whiteSpace: "nowrap" }}
          >
            {String(list.length).padStart(2, "0")}
          </span>
        </div>

        <div className="ry-testi-grid">
          {list.map((item, i) => {
            const rating = Math.max(0, Math.min(5, Math.round(item.rating || 0)));
            // first card gets a slight editorial offset on larger screens
            const accent = i % 3 === 1;
            return (
              <figure key={i} className={`ry-testi-card${accent ? " ry-testi-card--accent" : ""}`}>
                {/* oversized decorative quote mark */}
                <span className="ry-testi-quote font-heading" aria-hidden="true">
                  &ldquo;
                </span>

                {/* rating stars — terracotta */}
                <div
                  className="ry-testi-stars"
                  role="img"
                  aria-label={`${rating} von 5 Sternen`}
                >
                  {Array.from({ length: 5 }, (_, s) => (
                    <span key={s} className={s < rating ? "is-on" : "is-off"} aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>

                <blockquote className="ry-testi-text serif-italic">
                  {item.text}
                </blockquote>

                <figcaption className="ry-testi-author">
                  <span className="ry-testi-dash" aria-hidden="true" />
                  {item.name}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <style>{`
        .ry-testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.4rem, 2.4vw, 2.2rem);
        }
        @media (max-width: 960px) {
          .ry-testi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ry-testi-grid { grid-template-columns: 1fr; }
        }

        .ry-testi-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--color-bg-cream);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: clamp(1.9rem, 2.6vw, 2.6rem);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
        }
        .ry-testi-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-primary), var(--color-rose));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition);
        }
        .ry-testi-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-rose);
        }
        .ry-testi-card:hover::before { transform: scaleX(1); }

        /* one accent card per row — warm rosé wash */
        .ry-testi-card--accent {
          background: linear-gradient(155deg, var(--color-rose-soft), var(--color-bg-cream));
          border-color: var(--color-rose);
        }

        .ry-testi-quote {
          position: absolute;
          top: -.35rem;
          right: 1.2rem;
          font-size: 6.5rem;
          line-height: 1;
          color: var(--color-primary);
          opacity: .14;
          pointer-events: none;
          user-select: none;
        }

        .ry-testi-stars {
          display: inline-flex;
          gap: .18rem;
          font-size: 1.05rem;
          letter-spacing: .04em;
          margin-bottom: 1.1rem;
        }
        .ry-testi-stars .is-on { color: var(--color-primary); }
        .ry-testi-stars .is-off { color: var(--color-rose); opacity: .4; }

        .ry-testi-text {
          position: relative;
          z-index: 1;
          font-size: clamp(1.05rem, 1.6vw, 1.2rem);
          line-height: 1.62;
          color: var(--color-text);
          margin: 0 0 1.6rem;
          flex: 1;
        }

        .ry-testi-author {
          display: flex;
          align-items: center;
          gap: .65rem;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: .9rem;
          letter-spacing: .02em;
          color: var(--color-text);
        }
        .ry-testi-dash {
          display: inline-block;
          width: 24px;
          height: 1.5px;
          background: var(--color-primary);
          flex: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .ry-testi-card { transition: none; }
          .ry-testi-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
