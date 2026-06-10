import siteData from "../../data/site.json";

function SpinBadge() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "-34px",
        left: "-34px",
        width: 116,
        height: 116,
        zIndex: 3,
      }}
    >
      <div style={{ width: "100%", height: "100%", animation: "ry-spin 22s linear infinite" }}>
        <svg viewBox="0 0 100 100" width="116" height="116">
          <defs>
            <path id="ry-badge-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <circle cx="50" cy="50" r="49" fill="var(--color-olive)" />
          <text fill="var(--color-bg)" style={{ fontSize: "8.4px", letterSpacing: "2.1px", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
            <textPath href="#ry-badge-path" startOffset="0">
              · RUNAYOGA · BERLIN-PANKOW · KÖRPER &amp; SEELE
            </textPath>
          </text>
        </svg>
      </div>
      <span
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "1.5rem", color: "var(--color-rose)",
        }}
      >
        ✺
      </span>
    </div>
  );
}

export function Hero({
  title,
  subtitle,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink,
  image,
  imageAlt,
  layout = "right",
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondButtonText?: string;
  secondButtonLink?: string;
  image: string;
  imageAlt: string;
  layout: "left" | "right" | "center";
}) {
  const buttons = (
    <div className="flex gap-4 flex-wrap" style={{ marginTop: "2.4rem" }}>
      {buttonText && (
        <a href={buttonLink} className="btn-primary">
          {buttonText}
        </a>
      )}
      {secondButtonText && (
        <a href={secondButtonLink} className="btn-secondary">
          {secondButtonText}
        </a>
      )}
    </div>
  );

  /* ─────────── CENTER: editorial banner (image OR warm panel) ─────────── */
  if (layout === "center") {
    const hasImg = !!image;
    return (
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: hasImg ? "72vh" : "auto",
          padding: hasImg ? "10rem 1.5rem 6rem" : "11rem 1.5rem 5rem",
          backgroundImage: hasImg ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: hasImg ? "#fff" : "var(--color-text)",
        }}
      >
        {hasImg && (
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(43,38,34,.35), rgba(43,38,34,.62))" }} />
        )}
        {!hasImg && (
          <>
            <div className="blob" style={{ width: 360, height: 360, background: "rgba(217,169,143,.28)", top: -120, right: -90 }} />
            <div className="blob" style={{ width: 300, height: 300, background: "rgba(191,106,74,.13)", bottom: -120, left: -80 }} />
          </>
        )}
        <div className="relative z-10 text-center" style={{ maxWidth: 820 }}>
          <span className="kicker" style={hasImg ? { color: "var(--color-rose)" } : undefined}>
            {siteData.tagline}
          </span>
          <h1 className="display" style={{ marginTop: "1.4rem", color: hasImg ? "#fff" : "var(--color-text)" }}>
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "1.18rem",
                lineHeight: 1.6,
                maxWidth: 600,
                marginInline: "auto",
                color: hasImg ? "rgba(255,255,255,.9)" : "var(--color-text-light)",
              }}
            >
              {subtitle}
            </p>
          )}
          {(buttonText || secondButtonText) && (
            <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: "2.4rem" }}>
              {buttonText && <a href={buttonLink} className="btn-primary">{buttonText}</a>}
              {secondButtonText && (
                <a
                  href={secondButtonLink}
                  className="btn-secondary"
                  style={hasImg ? { color: "#fff", borderColor: "rgba(255,255,255,.75)", background: "rgba(255,255,255,.08)" } : undefined}
                >
                  {secondButtonText}
                </a>
              )}
            </div>
          )}
        </div>
        <Keyframes />
      </section>
    );
  }

  /* ─────────── SPLIT: asymmetric editorial hero ─────────── */
  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "9rem 1.5rem 4.5rem" }}
    >
      {/* Oversized faint decorative ring */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 620, height: 620, borderRadius: "50%",
          border: "1.5px solid var(--color-border)",
          top: "8%", right: layout === "left" ? "auto" : "-14%", left: layout === "left" ? "-14%" : "auto",
          opacity: .6,
        }}
      />
      <div className="blob" style={{ width: 420, height: 420, background: "rgba(217,169,143,.22)", top: -120, right: layout === "left" ? "auto" : -90, left: layout === "left" ? -90 : "auto" }} aria-hidden="true" />

      <div
        className="container relative z-10 grid items-center"
        style={{ gridTemplateColumns: "1.05fr .95fr", gap: "clamp(2rem, 6vw, 5.5rem)", minHeight: "78vh" }}
      >
        {/* Text */}
        <div className={layout === "left" ? "order-2" : ""}>
          <span className="kicker">✦ {siteData.name}</span>
          <h1 className="display" style={{ marginTop: "1.3rem" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ marginTop: "1.6rem", fontSize: "1.18rem", lineHeight: 1.65, color: "var(--color-text-light)", maxWidth: 480 }}>
              {subtitle}
            </p>
          )}
          {buttons}
        </div>

        {/* Image */}
        {image ? (
          <div className={`relative ${layout === "left" ? "order-1" : ""}`}>
            {/* offset terracotta frame for depth */}
            <div
              aria-hidden="true"
              className="absolute"
              style={{
                inset: 0,
                transform: "translate(18px, 18px)",
                borderRadius: "52% 48% 47% 53% / 58% 54% 46% 42%",
                border: "1.5px solid var(--color-primary)",
                opacity: .5,
              }}
            />
            <div className="organic-img relative" style={{ aspectRatio: "4/5", boxShadow: "var(--shadow-md)" }}>
              <img src={image} alt={imageAlt || title} className="w-full h-full" style={{ objectFit: "cover" }} />
            </div>
            <SpinBadge />
          </div>
        ) : (
          <div className={`relative ${layout === "left" ? "order-1" : ""}`} aria-hidden="true">
            <div
              className="organic-img relative"
              style={{
                aspectRatio: "4/5",
                background: "linear-gradient(150deg, var(--color-rose-soft), var(--color-bg-alt))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "5rem", color: "var(--color-primary)", opacity: .5 }}>
                ✺
              </span>
            </div>
            <SpinBadge />
          </div>
        )}
      </div>

      <Keyframes />
      <style>{`
        @media (max-width: 968px) {
          section > .container[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            gap: 3rem !important;
            text-align: center;
          }
          section > .container[style*="grid-template-columns"] .kicker { justify-content: center; }
          section > .container[style*="grid-template-columns"] p { margin-inline: auto; }
          section > .container[style*="grid-template-columns"] .flex { justify-content: center; }
          section > .container[style*="grid-template-columns"] > div:last-child { max-width: 380px; margin-inline: auto; }
        }
      `}</style>
    </section>
  );
}

function Keyframes() {
  return (
    <style>{`
      @keyframes ry-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        [style*="ry-spin"] { animation: none !important; }
      }
    `}</style>
  );
}
