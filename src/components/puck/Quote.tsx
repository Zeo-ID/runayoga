export function Quote({
  text,
  source,
  variant = "simple",
}: {
  text: string;
  source: string;
  variant: "simple" | "decorative";
}) {
  /* ─────────── DECORATIVE: olive editorial panel, oversized pull-quote ─────────── */
  if (variant === "decorative") {
    return (
      <section className="bg-olive relative overflow-hidden" style={{ padding: "clamp(5rem, 11vw, 9rem) 1.5rem" }}>
        {/* organic warm blobs for depth */}
        <div className="blob" aria-hidden="true" style={{ width: 460, height: 460, background: "rgba(217,169,143,.16)", top: -160, right: -120 }} />
        <div className="blob" aria-hidden="true" style={{ width: 360, height: 360, background: "rgba(191,106,74,.18)", bottom: -150, left: -110 }} />

        <figure className="container relative z-10" style={{ maxWidth: 940, textAlign: "center", margin: "0 auto" }}>
          {/* giant opening quotation ornament */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(5rem, 14vw, 9rem)",
              lineHeight: .6,
              color: "var(--color-rose)",
              opacity: .9,
              marginBottom: "0.6rem",
            }}
          >
            &ldquo;
          </span>

          <blockquote
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(1.9rem, 4.6vw, 3.4rem)",
              lineHeight: 1.18,
              letterSpacing: "-.015em",
              color: "var(--color-bg)",
            }}
          >
            {text}
          </blockquote>

          {source && (
            <figcaption style={{ marginTop: "2.4rem" }}>
              <span
                aria-hidden="true"
                style={{ display: "block", width: 48, height: 2, background: "var(--color-rose)", opacity: .8, margin: "0 auto 1.1rem" }}
              />
              <cite
                className="not-italic"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: ".74rem",
                  fontWeight: 500,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  color: "var(--color-rose)",
                }}
              >
                {source}
              </cite>
            </figcaption>
          )}
        </figure>
      </section>
    );
  }

  /* ─────────── SIMPLE: asymmetric editorial pull-quote on cream ─────────── */
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="blob" aria-hidden="true" style={{ width: 320, height: 320, background: "rgba(236,211,196,.4)", top: -90, left: -100 }} />

      <figure
        className="container relative z-10"
        style={{ maxWidth: 880, display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1.4rem, 4vw, 2.8rem)", alignItems: "start" }}
      >
        {/* oversized quotation mark, terracotta */}
        <span
          aria-hidden="true"
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(4rem, 11vw, 7rem)",
            lineHeight: .72,
            color: "var(--color-primary)",
            opacity: .85,
            marginTop: "-.15em",
          }}
        >
          &ldquo;
        </span>

        <div>
          <blockquote
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3.6vw, 2.7rem)",
              lineHeight: 1.3,
              letterSpacing: "-.012em",
              color: "var(--color-text)",
            }}
          >
            {text}
          </blockquote>

          {source && (
            <figcaption style={{ display: "flex", alignItems: "center", gap: ".75rem", marginTop: "1.6rem" }}>
              <span aria-hidden="true" style={{ width: 28, height: 1.5, background: "var(--color-primary)", display: "inline-block" }} />
              <cite
                className="not-italic"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: ".72rem",
                  fontWeight: 500,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                {source}
              </cite>
            </figcaption>
          )}
        </div>
      </figure>
    </section>
  );
}
