export function Quote({
  text,
  source,
  variant = "simple",
}: {
  text: string;
  source: string;
  variant: "simple" | "decorative";
}) {
  if (variant === "decorative") {
    return (
      <section
        className="text-white text-center"
        style={{ background: "var(--color-primary-dark)", padding: "5rem 2rem" }}
      >
        <div className="max-w-[800px] mx-auto">
          <blockquote
            className="font-heading italic mb-6"
            style={{ fontSize: "2.2rem", lineHeight: 1.5, opacity: .95 }}
          >
            &ldquo;{text}&rdquo;
          </blockquote>
          {source && (
            <cite className="not-italic" style={{ opacity: .7, fontSize: "1rem" }}>
              — {source}
            </cite>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <blockquote
        className="max-w-3xl mx-auto pl-6"
        style={{ borderLeft: "4px solid var(--color-primary)" }}
      >
        <p
          className="text-lg italic leading-relaxed mb-2"
          style={{ color: "var(--color-text)" }}
        >
          &ldquo;{text}&rdquo;
        </p>
        {source && (
          <cite className="text-sm not-italic" style={{ color: "var(--color-text-light)" }}>
            — {source}
          </cite>
        )}
      </blockquote>
    </section>
  );
}
