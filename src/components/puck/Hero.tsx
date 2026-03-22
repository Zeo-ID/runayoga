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
  if (layout === "center") {
    return (
      <section
        className="relative flex items-center justify-center min-h-[70vh] bg-cover bg-center text-white"
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-2xl px-6 py-20">
          <h1 className="font-heading text-4xl md:text-5xl mb-4" style={{ fontWeight: 500, lineHeight: 1.2 }}>
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle}</p>
          <div className="flex gap-4 justify-center flex-wrap">
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
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen grid items-center gap-16 relative overflow-hidden"
      style={{
        gridTemplateColumns: "1fr 1fr",
        padding: "8rem 2rem 4rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Organic blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          background: "rgba(122,139,111,.07)",
          top: -100, right: -100,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300,
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          background: "rgba(196,149,106,.06)",
          bottom: -80, left: -80,
        }}
      />

      <div className={`relative z-10 ${layout === "left" ? "order-2" : ""}`}>
        <h1
          className="font-heading mb-5"
          style={{ fontSize: "3.6rem", fontWeight: 500, lineHeight: 1.2, color: "var(--color-text)" }}
        >
          {title}
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "1.15rem", color: "var(--color-text-light)", maxWidth: 480 }}
        >
          {subtitle}
        </p>
        <div className="flex gap-4 flex-wrap">
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
      </div>

      {image && (
        <div
          className={`relative z-10 ${layout === "left" ? "order-1" : ""}`}
          style={{
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            overflow: "hidden",
            aspectRatio: "4/5",
          }}
        >
          <img
            src={image}
            alt={imageAlt || title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <style>{`
        @media (max-width: 968px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            text-align: center;
            min-height: auto !important;
            padding: 8rem 2rem 3rem !important;
          }
          section[style*="grid-template-columns: 1fr 1fr"] > div:last-child {
            max-width: 400px;
            margin: 0 auto;
          }
        }
        @media (max-width: 600px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            padding: 7rem 1.2rem 2rem !important;
          }
          section[style*="grid-template-columns: 1fr 1fr"] h1 {
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
