export function Cards({
  title,
  columns = 3,
  cards,
}: {
  title: string;
  columns: number;
  cards: { title: string; text: string; image: string; link: string }[];
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
        <div className={`grid grid-cols-1 ${colClass} gap-6`}>
          {(cards || []).map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold font-heading mb-2 text-[var(--color-text)]">
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--color-text-light)] mb-4">
                  {card.text}
                </p>
                {card.link && (
                  <a
                    href={card.link}
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Mehr erfahren →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
