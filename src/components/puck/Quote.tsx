export function Quote({
  text,
  source,
  variant = "simple",
}: {
  text: string;
  source: string;
  variant: "simple" | "decorative";
}) {
  if (variant === "decorative") {
    return (
      <section className="section-padding bg-[var(--color-bg-alt)]">
        <blockquote className="max-w-3xl mx-auto text-center">
          <span className="text-6xl text-[var(--color-primary)] opacity-30 leading-none block mb-2">
            &ldquo;
          </span>
          <p className="text-xl md:text-2xl italic text-[var(--color-text)] leading-relaxed mb-4">
            {text}
          </p>
          {source && (
            <cite className="text-sm text-[var(--color-text-light)] not-italic">
              — {source}
            </cite>
          )}
        </blockquote>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <blockquote className="max-w-3xl mx-auto border-l-4 border-[var(--color-primary)] pl-6">
        <p className="text-lg italic text-[var(--color-text)] leading-relaxed mb-2">
          &ldquo;{text}&rdquo;
        </p>
        {source && (
          <cite className="text-sm text-[var(--color-text-light)] not-italic">
            — {source}
          </cite>
        )}
      </blockquote>
    </section>
  );
}
