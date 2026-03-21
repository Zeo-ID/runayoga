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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
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
    <section className="section-padding">
      <div
        className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 ${
          layout === "left" ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-[var(--color-text)]">
            {title}
          </h1>
          <p className="text-lg text-[var(--color-text-light)]">{subtitle}</p>
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
