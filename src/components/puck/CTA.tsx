"use client";

export function CTA({
  title,
  text,
  buttonText,
  buttonLink,
  variant = "primary",
}: {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  variant: "primary" | "accent" | "dark";
}) {
  /* ── Variant → Terracotta Studio palette ──
     primary → Terracotta clay (warm, default)
     accent  → Rosé (soft, light-on-warm)
     dark     → Olive (deep contrast section) */
  const v =
    variant === "accent"
      ? {
          // Rosé panel — warm, light, ink text for contrast
          bg: "linear-gradient(150deg, var(--color-rose), var(--color-rose-soft))",
          ink: "var(--color-text)",
          inkSoft: "var(--color-text-light)",
          kicker: "var(--color-primary-dark)",
          line: "var(--color-primary-dark)",
          btnBg: "var(--color-primary)",
          btnFg: "#fff",
          btnHover: "var(--color-primary-dark)",
          blobA: "rgba(191,106,74,.18)",
          blobB: "rgba(63,69,52,.10)",
          glyph: "var(--color-primary)",
          ring: "rgba(159,80,54,.22)",
        }
      : variant === "dark"
      ? {
          // Olive panel — deep, cream text
          bg: "var(--color-olive)",
          ink: "var(--color-bg)",
          inkSoft: "rgba(243,235,225,.78)",
          kicker: "var(--color-rose)",
          line: "var(--color-rose)",
          btnBg: "var(--color-rose-soft)",
          btnFg: "var(--color-olive)",
          btnHover: "#fff",
          blobA: "rgba(217,169,143,.20)",
          blobB: "rgba(191,106,74,.18)",
          glyph: "var(--color-rose)",
          ring: "rgba(236,211,196,.20)",
        }
      : {
          // Terracotta panel — clay, cream text
          bg: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
          ink: "#fff",
          inkSoft: "rgba(255,255,255,.86)",
          kicker: "var(--color-rose-soft)",
          line: "var(--color-rose-soft)",
          btnBg: "#fff",
          btnFg: "var(--color-primary-dark)",
          btnHover: "var(--color-rose-soft)",
          blobA: "rgba(255,255,255,.14)",
          blobB: "rgba(43,38,34,.14)",
          glyph: "rgba(255,255,255,.5)",
          ring: "rgba(255,255,255,.22)",
        };

  return (
    <section className="section-padding">
      <div
        className="container relative overflow-hidden"
        style={{
          background: v.bg,
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          color: v.ink,
        }}
      >
        {/* Organic decorative blobs */}
        <div
          className="blob"
          aria-hidden="true"
          style={{ width: 420, height: 420, background: v.blobA, top: -160, right: -120 }}
        />
        <div
          className="blob"
          aria-hidden="true"
          style={{ width: 320, height: 320, background: v.blobB, bottom: -150, left: -110 }}
        />
        {/* Faint oversized ring for editorial depth */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `1.5px solid ${v.ring}`,
            top: "-46%",
            left: "-8%",
          }}
        />
        {/* Oversized italic Fraunces glyph, asymmetric */}
        <span
          aria-hidden="true"
          className="absolute select-none"
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            fontSize: "13rem",
            lineHeight: 1,
            color: v.glyph,
            right: "4%",
            bottom: "-2.5rem",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        >
          ✺
        </span>

        {/* Content — asymmetric, left-aligned editorial block */}
        <div
          className="relative z-10"
          style={{
            padding: "clamp(3.5rem, 7vw, 6rem) clamp(1.6rem, 6vw, 5rem)",
            maxWidth: 720,
          }}
        >
          <span
            className="kicker"
            style={{ color: v.kicker, ["--kicker-line" as string]: v.line }}
          >
            Bereit?
          </span>
          <h2
            className="font-heading"
            style={{
              marginTop: "1.3rem",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-.022em",
              color: v.ink,
            }}
          >
            {title}
          </h2>
          {text && (
            <p
              style={{
                marginTop: "1.4rem",
                maxWidth: 540,
                fontSize: "1.15rem",
                lineHeight: 1.65,
                color: v.inkSoft,
              }}
            >
              {text}
            </p>
          )}
          {buttonText && (
            <div style={{ marginTop: "2.4rem" }}>
              <a
                href={buttonLink}
                className="inline-flex items-center"
                style={{
                  gap: ".6rem",
                  background: v.btnBg,
                  color: v.btnFg,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: ".95rem",
                  letterSpacing: ".01em",
                  padding: "1rem 2.2rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                  willChange: "transform",
                  transition:
                    "transform var(--transition), box-shadow var(--transition), background var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.background = v.btnHover;
                  const arrow = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
                  if (arrow) arrow.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = v.btnBg;
                  const arrow = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
                  if (arrow) arrow.style.transform = "translateX(0)";
                }}
              >
                {buttonText}
                <span
                  data-arrow
                  aria-hidden="true"
                  style={{
                    fontSize: "1.05em",
                    transition: "transform var(--transition)",
                  }}
                >
                  →
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Per-instance kicker line color override */}
      <style>{`
        section .kicker[style*="--kicker-line"]::before {
          background: var(--kicker-line);
        }
      `}</style>
    </section>
  );
}
