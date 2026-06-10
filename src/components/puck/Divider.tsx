export function Divider({
  style = "space",
  height = 48,
}: {
  style: "line" | "space" | "decorative";
  height: number;
}) {
  const padY = Math.max(height / 2, 8);

  /* ─────────── LINE: a true editorial hairline, fading at the edges ─────────── */
  if (style === "line") {
    return (
      <div className="container" style={{ padding: `${padY}px clamp(1.2rem, 5vw, 2.5rem)` }}>
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--color-border) 18%, var(--color-border) 82%, transparent)",
          }}
        />
      </div>
    );
  }

  /* ─────────── DECORATIVE: organic asterisk motif over a soft terracotta line ─────────── */
  if (style === "decorative") {
    return (
      <div
        className="flex justify-center items-center"
        aria-hidden="true"
        style={{ padding: `${padY}px clamp(1.2rem, 5vw, 2.5rem)` }}
      >
        <div
          className="flex items-center"
          style={{ gap: "1.1rem", width: "100%", maxWidth: 420 }}
        >
          {/* left fading rule */}
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--color-rose) 90%, var(--color-primary))",
            }}
          />
          {/* terracotta tick */}
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--color-rose)",
              flexShrink: 0,
            }}
          />
          {/* central serif asterisk — the organic studio motif */}
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontSize: "1.7rem",
              lineHeight: 1,
              color: "var(--color-primary)",
              flexShrink: 0,
              transform: "translateY(-1px)",
            }}
          >
            ✳
          </span>
          {/* terracotta tick */}
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--color-rose)",
              flexShrink: 0,
            }}
          />
          {/* right fading rule (mirrored) */}
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, var(--color-primary), var(--color-rose) 10%, transparent)",
            }}
          />
        </div>
      </div>
    );
  }

  /* ─────────── SPACE: pure breathing room ─────────── */
  return <div aria-hidden="true" style={{ height: `${height}px` }} />;
}
