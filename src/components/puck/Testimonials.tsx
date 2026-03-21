export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { text: string; name: string; rating: number }[];
}) {
  return (
    <section className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-10 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items || []).map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }, (_, s) => (
                  <span
                    key={s}
                    className={s < item.rating ? "text-yellow-400" : "text-gray-200"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[var(--color-text-light)] mb-4 italic">
                &ldquo;{item.text}&rdquo;
              </p>
              <p className="font-semibold text-sm text-[var(--color-text)]">
                — {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
