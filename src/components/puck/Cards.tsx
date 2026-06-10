"use client";

import { t } from "../../data/ui";
import type { Locale } from "../../lib/i18n";

export function Cards({
  title,
  columns = 3,
  cards,
  locale = "de",
}: {
  title: string;
  columns: number;
  cards: { title: string; text: string; image: string; link: string }[];
  locale?: Locale;
}) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  const list = cards || [];

  return (
    <section className="section-padding relative overflow-hidden bg-alt">
      {/* organic background accents */}
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 360, height: 360, background: "rgba(217,169,143,.20)", top: -130, right: -90 }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 300, height: 300, background: "rgba(191,106,74,.10)", bottom: -120, left: -80 }}
      />

      <div className="container relative z-10">
        {title && (
          <header
            className="cards-head"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "clamp(2.6rem, 5vw, 4rem)",
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <span className="kicker">✦ {t("Entdecken", locale)}</span>
              <h2 className="display-sm" style={{ marginTop: "1.1rem" }}>
                {title}
              </h2>
            </div>
            <span
              className="serif-italic"
              aria-hidden="true"
              style={{ fontSize: "1.05rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", paddingBottom: ".4rem" }}
            >
              {String(list.length).padStart(2, "0")} {list.length === 1 ? t("Eintrag", locale) : t("Einträge", locale)}
            </span>
          </header>
        )}

        <div className={`grid grid-cols-1 ${colClass}`} style={{ gap: "clamp(1.4rem, 3vw, 2.2rem)" }}>
          {list.map((card, i) => {
            const isLink = !!card.link;
            const Tag = (isLink ? "a" : "div") as "a" | "div";

            return (
              <Tag
                key={i}
                href={isLink ? card.link : undefined}
                className="ry-card group relative flex flex-col"
                style={{
                  background: "var(--color-bg-cream)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  transition:
                    "transform var(--transition), box-shadow var(--transition), border-color var(--transition)",
                  willChange: "transform",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  e.currentTarget.style.borderColor = "var(--color-rose)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                {/* media */}
                {card.image ? (
                  <div className="relative" style={{ overflow: "hidden" }}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="ry-card-img w-full"
                      style={{
                        height: "15rem",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform .7s cubic-bezier(.2,.7,.2,1)",
                      }}
                    />
                    {/* index badge over image */}
                    <span
                      className="index-num"
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: ".9rem",
                        left: "1.1rem",
                        fontSize: "2.6rem",
                        lineHeight: 1,
                        opacity: 1,
                        color: "#fff",
                        textShadow: "0 2px 14px rgba(43,38,34,.45)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ) : (
                  <div
                    className="relative flex items-center justify-center"
                    aria-hidden="true"
                    style={{
                      height: "15rem",
                      background: "linear-gradient(150deg, var(--color-rose-soft), var(--color-bg-alt))",
                    }}
                  >
                    <span
                      className="index-num"
                      style={{ fontSize: "4rem", lineHeight: 1, opacity: 0.5 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* body */}
                <div
                  className="flex flex-col flex-1"
                  style={{ padding: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  <h3
                    className="font-heading"
                    style={{
                      fontSize: "clamp(1.4rem, 2.4vw, 1.7rem)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                      letterSpacing: "-.01em",
                      color: "var(--color-text)",
                    }}
                  >
                    {card.title}
                  </h3>

                  {card.text && (
                    <p
                      style={{
                        marginTop: ".7rem",
                        fontSize: ".96rem",
                        lineHeight: 1.65,
                        color: "var(--color-text-light)",
                      }}
                    >
                      {card.text}
                    </p>
                  )}

                  {isLink && (
                    <span
                      className="link-arrow"
                      style={{ marginTop: "1.4rem", fontSize: ".9rem" }}
                    >
                      {t("Mehr erfahren", locale)}
                      <span className="ry-arrow" aria-hidden="true" style={{ transition: "transform var(--transition)" }}>
                        →
                      </span>
                    </span>
                  )}
                </div>

                {/* organic terracotta corner accent */}
                <span
                  aria-hidden="true"
                  className="ry-card-accent"
                  style={{
                    position: "absolute",
                    bottom: -34,
                    right: -34,
                    width: 88,
                    height: 88,
                    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                    background: "rgba(191,106,74,.12)",
                    transition: "transform var(--transition), background var(--transition)",
                    pointerEvents: "none",
                  }}
                />
              </Tag>
            );
          })}
        </div>
      </div>

      <style>{`
        .ry-card:hover .ry-card-img { transform: scale(1.06); }
        .ry-card:hover .ry-arrow { transform: translateX(5px); }
        .ry-card:hover .ry-card-accent {
          transform: scale(1.25);
          background: rgba(191,106,74,.18);
        }
        @media (max-width: 640px) {
          .cards-head { align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
