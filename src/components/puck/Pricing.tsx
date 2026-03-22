"use client";

export function Pricing({
  title,
  packages,
}: {
  title: string;
  packages: {
    name: string;
    price: string;
    period?: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    highlighted: boolean;
  }[];
}) {
  return (
    <section className="section-padding">
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
        <div
          className={`grid grid-cols-1 gap-8 items-start ${
            (packages || []).length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : (packages || []).length >= 3
              ? "md:grid-cols-3"
              : ""
          }`}
        >
          {(packages || []).map((pkg, i) => (
            <div
              key={i}
              className="text-center flex flex-col"
              style={{
                background: pkg.highlighted ? "var(--color-primary)" : "#fff",
                border: pkg.highlighted ? "2px solid var(--color-primary)" : "2px solid rgba(122,139,111,.15)",
                borderRadius: "var(--radius)",
                padding: "2.5rem 2rem",
                transition: "transform var(--transition), box-shadow var(--transition)",
                transform: pkg.highlighted ? "scale(1.04)" : "none",
                color: pkg.highlighted ? "#fff" : "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = pkg.highlighted ? "scale(1.04) translateY(-4px)" : "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = pkg.highlighted ? "scale(1.04)" : "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                className="font-heading mb-2"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  color: pkg.highlighted ? "#fff" : "var(--color-text)",
                }}
              >
                {pkg.name}
              </h3>
              <p
                className="font-heading mb-1"
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 600,
                  color: pkg.highlighted ? "#fff" : "var(--color-primary)",
                }}
              >
                {pkg.price}
              </p>
              {pkg.period && (
                <p
                  className="mb-6"
                  style={{
                    fontSize: ".85rem",
                    color: pkg.highlighted ? "rgba(255,255,255,.7)" : "var(--color-text-muted)",
                  }}
                >
                  {pkg.period}
                </p>
              )}
              <ul className="text-left mb-8 flex-1" style={{ marginTop: pkg.period ? 0 : "1.5rem" }}>
                {(Array.isArray(pkg.features) ? pkg.features : []).map((feat, j) => {
                  const text = typeof feat === "string" ? feat : (feat as any)?.value || "";
                  return (
                    <li
                      key={j}
                      className="flex items-center gap-2"
                      style={{
                        padding: ".45rem 0",
                        fontSize: ".92rem",
                        color: pkg.highlighted ? "rgba(255,255,255,.9)" : "var(--color-text-light)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: ".85rem",
                          flexShrink: 0,
                          color: pkg.highlighted ? "#d4c5a9" : "var(--color-primary)",
                        }}
                      >
                        ✓
                      </span>
                      {text}
                    </li>
                  );
                })}
              </ul>
              {pkg.buttonText && (
                <a
                  href={pkg.buttonLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: ".85rem 2rem",
                    borderRadius: "50px",
                    fontWeight: 500,
                    fontSize: ".95rem",
                    textDecoration: "none",
                    transition: "transform var(--transition), box-shadow var(--transition), background var(--transition)",
                    background: pkg.highlighted ? "#fff" : "var(--color-primary)",
                    color: pkg.highlighted ? "var(--color-primary)" : "#fff",
                    border: pkg.highlighted ? "2px solid #fff" : "2px solid var(--color-primary)",
                  }}
                >
                  {pkg.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
