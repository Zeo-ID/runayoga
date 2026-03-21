export function Gallery({
  title,
  columns = 3,
  images,
}: {
  title: string;
  columns: number;
  images: { src: string; alt: string; caption: string }[];
}) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-10 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${colClass} gap-4`}>
          {(images || []).map((img, i) => (
            <figure key={i} className="group overflow-hidden rounded-lg">
              <img
                src={img.src}
                alt={img.alt || ""}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {img.caption && (
                <figcaption className="text-sm text-[var(--color-text-light)] mt-2 text-center">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        {(!images || images.length === 0) && (
          <p className="text-center text-[var(--color-text-light)]">
            Noch keine Bilder hinzugefügt.
          </p>
        )}
      </div>
    </section>
  );
}
