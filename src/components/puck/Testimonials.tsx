export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { text: string; name: string; rating: number }[];
}) {
  return (
    <section className="section-padding" style={{ background: "var(--color-bg-alt)" }}>
      <div className="max-w-[1200px] mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2
              className="font-heading"
              style={{ fontSize: "2.4rem", fontWeight: 500, lineHeight: 1.2, color: "var(--color-text)" }}
            >
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(items || []).map((item, i) => (
            <div
              key={i}
              className="relative"
              style={{
                background: "#fff",
                borderRadius: "var(--radius)",
                padding: "2.2rem",
              }}
            >
              {/* Decorative quote mark */}
              <span
                className="font-heading absolute"
                style={{
                  fontSize: "5rem",
                  color: "var(--color-primary-light)",
                  opacity: .25,
                  top: ".2rem",
                  left: "1.4rem",
                  lineHeight: 1,
                }}
              >
                &ldquo;
              </span>

              <div className="mb-3" style={{ color: "var(--color-accent)", fontSize: ".9rem", letterSpacing: "2px" }}>
                {Array.from({ length: 5 }, (_, s) => (
                  <span key={s} style={{ opacity: s < item.rating ? 1 : 0.3 }}>★</span>
                ))}
              </div>

              <p
                className="relative italic mb-5"
                style={{ fontSize: ".95rem", color: "var(--color-text-light)", zIndex: 1 }}
              >
                {item.text}
              </p>

              <p style={{ fontWeight: 500, fontSize: ".88rem", color: "var(--color-text)" }}>
                — {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
