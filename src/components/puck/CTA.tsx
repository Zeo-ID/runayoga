export function CTA({
  title,
  text,
  buttonText,
  buttonLink,
  variant = "primary",
}: {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  variant: "primary" | "accent" | "dark";
}) {
  const bgClass =
    variant === "accent"
      ? "bg-[var(--color-accent)]"
      : variant === "dark"
      ? "bg-gray-900"
      : "bg-[var(--color-primary)]";

  return (
    <section className={`${bgClass} text-white py-16 px-6`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold font-heading mb-4">{title}</h2>
        <p className="text-lg opacity-90 mb-8">{text}</p>
        {buttonText && (
          <a
            href={buttonLink}
            className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
