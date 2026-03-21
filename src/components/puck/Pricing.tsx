export function Pricing({
  title,
  packages,
}: {
  title: string;
  packages: {
    name: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    highlighted: boolean;
  }[];
}) {
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-10 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 gap-6 ${
            (packages || []).length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : (packages || []).length >= 3
              ? "md:grid-cols-3"
              : ""
          }`}
        >
          {(packages || []).map((pkg, i) => (
            <div
              key={i}
              className={`rounded-xl p-8 border flex flex-col ${
                pkg.highlighted
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-lg scale-105"
                  : "border-[var(--color-border)] bg-white shadow-sm"
              }`}
            >
              <h3 className="text-xl font-bold font-heading mb-2 text-[var(--color-text)]">
                {pkg.name}
              </h3>
              <p className="text-3xl font-bold text-[var(--color-primary)] mb-6">
                {pkg.price}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {(Array.isArray(pkg.features) ? pkg.features : []).map(
                  (feat, j) => {
                    const text =
                      typeof feat === "string" ? feat : (feat as any)?.value || "";
                    return (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-[var(--color-text-light)]"
                      >
                        <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                        {text}
                      </li>
                    );
                  }
                )}
              </ul>
              {pkg.buttonText && (
                <a
                  href={pkg.buttonLink}
                  className={`block text-center font-semibold py-3 rounded-lg transition-colors ${
                    pkg.highlighted
                      ? "btn-primary"
                      : "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                  }`}
                >
                  {pkg.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
