"use client";

export function Cards({
  title,
  columns = 3,
  cards,
}: {
  title: string;
  columns: number;
  cards: { title: string; text: string; image: string; link: string }[];
}) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-2 lg:grid-cols-3";

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
        <div className={`grid grid-cols-1 ${colClass} gap-8`}>
          {(cards || []).map((card, i) => (
            <a
              key={i}
              href={card.link || undefined}
              className="block text-center overflow-hidden"
              style={{
                background: "#fff",
                borderRadius: "var(--radius)",
                padding: "2.2rem",
                transition: "transform var(--transition), box-shadow var(--transition)",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover mb-5"
                  style={{ borderRadius: "var(--radius)" }}
                />
              ) : (
                <div
                  className="mx-auto mb-5 flex items-center justify-center"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))",
                  }}
                />
              )}
              <h3
                className="font-heading mb-2"
                style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--color-text)" }}
              >
                {card.title}
              </h3>
              <p className="mb-4" style={{ fontSize: ".93rem", color: "var(--color-text-light)" }}>
                {card.text}
              </p>
              {card.link && (
                <span
                  className="inline-flex items-center gap-1"
                  style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--color-primary)" }}
                >
                  Mehr erfahren →
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
