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
  return (
    <section className="section-padding">
      <div
        className="max-w-[1200px] mx-auto grid items-center gap-16"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        <div className={imagePosition === "left" ? "order-2" : ""}>
          {title && (
            <h2
              className="font-heading mb-4"
              style={{ fontSize: "2.4rem", fontWeight: 500, lineHeight: 1.2, color: "var(--color-text)" }}
            >
              {title}
            </h2>
          )}
          <div
            className="prose"
            style={{ fontSize: "1.02rem", color: "var(--color-text-light)" }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        {image && (
          <div className={imagePosition === "left" ? "order-1" : ""}>
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full object-cover"
              style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 968px) {
          .section-padding > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
