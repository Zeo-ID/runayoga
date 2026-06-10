"use client";

import { useState } from "react";

export function FAQ({
  title,
  items,
}: {
  title: string;
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const list = items || [];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* organic warm blobs for depth */}
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 380, height: 380, background: "rgba(236,211,196,.4)", top: -140, right: -120 }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{ width: 300, height: 300, background: "rgba(191,106,74,.1)", bottom: -120, left: -110 }}
      />

      <div
        className="container relative z-10 grid items-start"
        style={{ gridTemplateColumns: ".82fr 1.18fr", gap: "clamp(2.5rem, 6vw, 6rem)" }}
      >
        {/* ─── Editorial header column (sticky on desktop) ─── */}
        <div className="ry-faq-head">
          <span className="kicker">✦ Fragen &amp; Antworten</span>
          <h2 className="display-sm" style={{ marginTop: "1.3rem" }}>
            {title || "Häufige Fragen"}
          </h2>
          <p
            style={{
              marginTop: "1.4rem",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--color-text-light)",
              maxWidth: 340,
            }}
          >
            Alles, was du vor deinem ersten Besuch wissen möchtest — und falls eine
            Frage offen bleibt, sind wir{" "}
            <span className="serif-italic" style={{ color: "var(--color-primary)" }}>
              gerne persönlich
            </span>{" "}
            für dich da.
          </p>
        </div>

        {/* ─── Accordion column ─── */}
        <div>
          {list.map((item, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={i}
                style={{
                  borderTop: "1px solid var(--color-border)",
                  borderBottom: i === list.length - 1 ? "1px solid var(--color-border)" : undefined,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="ry-faq-q"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.5rem",
                    padding: "1.7rem .25rem",
                    background: "transparent",
                    border: 0,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="index-num"
                    aria-hidden="true"
                    style={{
                      fontSize: "1.15rem",
                      lineHeight: 1.35,
                      flexShrink: 0,
                      transition: "opacity var(--transition)",
                      opacity: isOpen ? 1 : 0.5,
                    }}
                  >
                    {num}
                  </span>

                  <span
                    style={{
                      flex: 1,
                      fontFamily: "Fraunces, serif",
                      fontWeight: 500,
                      fontSize: "clamp(1.18rem, 2vw, 1.42rem)",
                      lineHeight: 1.32,
                      letterSpacing: "-.01em",
                      color: isOpen ? "var(--color-primary-dark)" : "var(--color-text)",
                      transition: "color var(--transition)",
                    }}
                  >
                    {item.question}
                  </span>

                  {/* Terracotta indicator */}
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                      border: "1.5px solid var(--color-primary)",
                      background: isOpen ? "var(--color-primary)" : "transparent",
                      transition:
                        "background var(--transition), transform var(--transition), box-shadow var(--transition)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      boxShadow: isOpen ? "0 8px 22px rgba(159,80,54,.28)" : "none",
                    }}
                  >
                    {/* plus glyph drawn with two bars → rotates into ✕ when open */}
                    <span
                      style={{
                        position: "relative",
                        width: 13,
                        height: 13,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          width: "100%",
                          height: 1.5,
                          marginTop: -0.75,
                          background: isOpen ? "#fff" : "var(--color-primary)",
                          transition: "background var(--transition)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          height: "100%",
                          width: 1.5,
                          marginLeft: -0.75,
                          background: isOpen ? "#fff" : "var(--color-primary)",
                          transition: "background var(--transition)",
                        }}
                      />
                    </span>
                  </span>
                </button>

                {/* Answer — smooth grid-based reveal */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows var(--transition)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        paddingLeft: "calc(1.15rem + 1.5rem)",
                        paddingRight: "calc(38px + 1.5rem)",
                        paddingBottom: "1.8rem",
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? "none" : "translateY(-6px)",
                        transition: "opacity var(--transition), transform var(--transition)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.02rem",
                          lineHeight: 1.78,
                          color: "var(--color-text-light)",
                          maxWidth: 580,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ry-faq-head { position: sticky; top: 6rem; }
        .ry-faq-q:hover .index-num { opacity: 1; }
        .ry-faq-q:hover span[style*="border-radius: 50%"] {
          box-shadow: 0 8px 22px rgba(159,80,54,.18);
        }
        @media (max-width: 880px) {
          section > .container[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .ry-faq-head { position: static; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ry-faq-q span, .ry-faq-q ~ div * { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
