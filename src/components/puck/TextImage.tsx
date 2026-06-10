export function TextImage({
  title,
  text,
  image,
  imageAlt,
  imagePosition = "right",
}: {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
}) {
  const imageLeft = imagePosition === "left";

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Soft organic accent — sits behind the image side */}
      <div
        className="blob"
        aria-hidden="true"
        style={{
          width: 380,
          height: 380,
          background: "rgba(217,169,143,.20)",
          top: "-90px",
          right: imageLeft ? "auto" : "-110px",
          left: imageLeft ? "-110px" : "auto",
        }}
      />

      <div
        className="container relative z-10 grid items-center"
        style={{
          gridTemplateColumns: imageLeft ? ".95fr 1.05fr" : "1.05fr .95fr",
          gap: "clamp(2.5rem, 6vw, 5.5rem)",
        }}
      >
        {/* ─────────── Text ─────────── */}
        <div className={imageLeft ? "order-2" : ""}>
          <span className="kicker">✦ Runayoga</span>
          {title && (
            <h2 className="display-sm" style={{ marginTop: "1.2rem", marginBottom: "1.4rem" }}>
              {title}
            </h2>
          )}
          <div
            className="prose"
            style={{ fontSize: "1.05rem", maxWidth: "32rem" }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>

        {/* ─────────── Image ─────────── */}
        {image ? (
          <div className={`relative ti-figure ${imageLeft ? "order-1" : ""}`}>
            {/* Offset terracotta frame for editorial depth */}
            <div
              aria-hidden="true"
              className="absolute"
              style={{
                inset: 0,
                transform: imageLeft ? "translate(-18px, 18px)" : "translate(18px, 18px)",
                borderRadius: "52% 48% 47% 53% / 58% 54% 46% 42%",
                border: "1.5px solid var(--color-primary)",
                opacity: 0.45,
                transition: "transform var(--transition)",
              }}
            />
            <div
              className="organic-img relative ti-img"
              style={{ aspectRatio: "4/5", boxShadow: "var(--shadow-md)" }}
            >
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
              />
            </div>
            {/* Small serif accent mark */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-22px",
                right: imageLeft ? "auto" : "-10px",
                left: imageLeft ? "-10px" : "auto",
                fontFamily: "Fraunces, serif",
                fontStyle: "italic",
                fontSize: "2.4rem",
                color: "var(--color-rose)",
                zIndex: 3,
              }}
            >
              ✺
            </span>
          </div>
        ) : (
          <div className={`relative ${imageLeft ? "order-1" : ""}`} aria-hidden="true">
            <div
              className="organic-img relative"
              style={{
                aspectRatio: "4/5",
                background: "linear-gradient(150deg, var(--color-rose-soft), var(--color-bg-alt))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  fontFamily: "Fraunces, serif",
                  fontStyle: "italic",
                  fontSize: "5rem",
                  color: "var(--color-primary)",
                  opacity: 0.5,
                }}
              >
                ✺
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ti-figure:hover .ti-img {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }
        .ti-figure:hover > .absolute {
          transform: translate(0, 0) !important;
        }
        .ti-img {
          transition: transform var(--transition), box-shadow var(--transition);
        }
        @media (max-width: 968px) {
          section.section-padding > .container[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          section.section-padding > .container[style*="grid-template-columns"] .order-1 {
            order: -1;
          }
          section.section-padding > .container[style*="grid-template-columns"] .prose {
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}
