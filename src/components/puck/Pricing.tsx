"use client";

import siteData from "../../data/site.json";

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
  const list = packages || [];
  const cols = list.length === 2 ? "1fr 1fr" : list.length >= 3 ? "1fr 1fr 1fr" : "1fr";
  const wrapMax = list.length === 2 ? 880 : list.length >= 3 ? 1180 : 560;

  return (
    <section className="section-padding bg-alt relative overflow-hidden">
      {/* Organic warm decoration */}
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 460, height: 460, background: "rgba(217,169,143,.20)", top: -160, right: -140 }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 360, height: 360, background: "rgba(191,106,74,.10)", bottom: -140, left: -120 }}
      />

      <div className="container relative z-10">
        {/* ─────────── Editorial header (asymmetric) ─────────── */}
        <div
          className="ry-pricing-header grid items-end"
          style={{
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(1.5rem, 5vw, 4rem)",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          <div>
            <span className="kicker">✦ {siteData.name}</span>
            {title && (
              <h2 className="display-sm" style={{ marginTop: "1.2rem", maxWidth: 640 }}>
                {title}
              </h2>
            )}
          </div>
          <div className="ry-pricing-lead" style={{ paddingBottom: ".5rem" }}>
            <p
              className="serif-italic"
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.5,
                color: "var(--color-text-light)",
                maxWidth: 320,
                marginLeft: "auto",
                textAlign: "right",
              }}
            >
              Klar, fair, ohne Kleingedrucktes.
            </p>
          </div>
        </div>

        {/* ─────────── Cards ─────────── */}
        <div
          className="ry-pricing-grid grid items-stretch"
          style={{
            gridTemplateColumns: cols,
            gap: "clamp(1.4rem, 2.5vw, 2.2rem)",
            maxWidth: wrapMax,
            marginInline: "auto",
          }}
        >
          {list.map((pkg, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={i}
                className="ry-pricing-card relative flex flex-col"
                style={{
                  background: pkg.highlighted ? "var(--color-olive)" : "var(--color-white)",
                  border: pkg.highlighted
                    ? "1.5px solid var(--color-olive)"
                    : "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "clamp(2rem, 3vw, 2.75rem) clamp(1.75rem, 2.5vw, 2.4rem)",
                  color: pkg.highlighted ? "var(--color-bg)" : "var(--color-text)",
                  boxShadow: pkg.highlighted ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  overflow: "hidden",
                  transition: "transform var(--transition), box-shadow var(--transition)",
                  ...(pkg.highlighted ? { zIndex: 2 } : {}),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = pkg.highlighted
                    ? "var(--shadow-lg)"
                    : "var(--shadow-sm)";
                }}
              >
                {/* Highlight corner blob (terracotta accent) */}
                {pkg.highlighted && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -70,
                      right: -70,
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(191,106,74,.55), rgba(191,106,74,0) 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Editorial index number */}
                <span
                  className="index-num"
                  style={{
                    fontSize: "2.1rem",
                    lineHeight: 1,
                    color: pkg.highlighted ? "var(--color-rose)" : "var(--color-primary)",
                    opacity: pkg.highlighted ? 0.85 : 0.5,
                  }}
                >
                  {num}
                </span>

                {/* Recommendation pill */}
                {pkg.highlighted && (
                  <span
                    style={{
                      position: "absolute",
                      top: "clamp(2rem, 3vw, 2.75rem)",
                      right: "clamp(1.75rem, 2.5vw, 2.4rem)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: ".4rem",
                      padding: ".4rem .85rem",
                      borderRadius: "100px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: ".64rem",
                      fontWeight: 600,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      background: "var(--color-primary)",
                      color: "#fff",
                    }}
                  >
                    ✦ Empfohlen
                  </span>
                )}

                {/* Name */}
                <h3
                  className="font-heading"
                  style={{
                    marginTop: "1.1rem",
                    fontSize: "1.55rem",
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: pkg.highlighted ? "var(--color-bg)" : "var(--color-text)",
                  }}
                >
                  {pkg.name}
                </h3>

                {/* Price */}
                <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "baseline", gap: ".5rem", flexWrap: "wrap" }}>
                  <span
                    className="font-heading"
                    style={{
                      fontSize: "clamp(2.6rem, 4.5vw, 3.4rem)",
                      fontWeight: 500,
                      lineHeight: 1,
                      letterSpacing: "-.02em",
                      color: pkg.highlighted ? "var(--color-rose-soft)" : "var(--color-primary)",
                    }}
                  >
                    {pkg.price}
                  </span>
                  {pkg.period && (
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: ".85rem",
                        fontWeight: 400,
                        color: pkg.highlighted ? "rgba(243,235,225,.65)" : "var(--color-text-muted)",
                      }}
                    >
                      {pkg.period}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <hr
                  className="hairline"
                  style={{
                    margin: "1.6rem 0",
                    background: pkg.highlighted ? "rgba(243,235,225,.18)" : "var(--color-border)",
                  }}
                />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: ".85rem" }}>
                  {(Array.isArray(pkg.features) ? pkg.features : []).map((feat, j) => {
                    const text = typeof feat === "string" ? feat : (feat as any)?.value || "";
                    return (
                      <li
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: ".7rem",
                          fontFamily: "Inter, sans-serif",
                          fontSize: ".95rem",
                          lineHeight: 1.5,
                          color: pkg.highlighted ? "rgba(243,235,225,.92)" : "var(--color-text-light)",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            flexShrink: 0,
                            marginTop: ".2rem",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: ".62rem",
                            fontWeight: 700,
                            lineHeight: 1,
                            background: pkg.highlighted
                              ? "var(--color-primary)"
                              : "var(--color-rose-soft)",
                            color: pkg.highlighted ? "#fff" : "var(--color-primary-dark)",
                          }}
                        >
                          ✓
                        </span>
                        <span>{text}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
                {pkg.buttonText && (
                  <a
                    href={pkg.buttonLink}
                    className="ry-pricing-cta"
                    style={{
                      marginTop: "2.2rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: ".5rem",
                      padding: "1rem 1.6rem",
                      borderRadius: "100px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: ".95rem",
                      letterSpacing: ".01em",
                      textDecoration: "none",
                      transition:
                        "transform var(--transition), box-shadow var(--transition), background var(--transition), color var(--transition), border-color var(--transition)",
                      background: pkg.highlighted ? "var(--color-primary)" : "transparent",
                      color: pkg.highlighted ? "#fff" : "var(--color-text)",
                      border: pkg.highlighted
                        ? "1.5px solid var(--color-primary)"
                        : "1.5px solid var(--color-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      if (pkg.highlighted) {
                        e.currentTarget.style.background = "var(--color-primary-dark)";
                        e.currentTarget.style.borderColor = "var(--color-primary-dark)";
                        e.currentTarget.style.boxShadow = "0 18px 36px rgba(159,80,54,.32)";
                      } else {
                        e.currentTarget.style.background = "var(--color-text)";
                        e.currentTarget.style.color = "var(--color-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                      if (pkg.highlighted) {
                        e.currentTarget.style.background = "var(--color-primary)";
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                      } else {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text)";
                      }
                    }}
                  >
                    {pkg.buttonText}
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          section .ry-pricing-grid { grid-template-columns: 1fr !important; max-width: 460px !important; }
          section .ry-pricing-card { z-index: auto !important; }
        }
        @media (max-width: 720px) {
          section .ry-pricing-header { grid-template-columns: 1fr !important; }
          section .ry-pricing-lead { display: none; }
        }
      `}</style>
    </section>
  );
}
