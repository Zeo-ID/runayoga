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
        className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 ${
          imagePosition === "left" ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="flex-1 space-y-4">
          {title && (
            <h2 className="text-3xl font-bold font-heading text-[var(--color-text)]">
              {title}
            </h2>
          )}
          <div
            className="text-[var(--color-text-light)] leading-relaxed prose"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        {image && (
          <div className="flex-1">
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
