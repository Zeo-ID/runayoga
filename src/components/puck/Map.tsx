import { t } from "../../data/ui";
import type { Locale } from "../../lib/i18n";

export function Map({
  title,
  address,
  zoom,
  height,
  rounded,
  locale = "de",
}: {
  title: string;
  address: string;
  zoom: number;
  height: number;
  rounded: boolean;
  locale?: Locale;
}) {
  if (!address) {
    return (
      <section className="section-padding">
        <div className="max-w-5xl mx-auto text-center text-[var(--color-text-light)]">
          Bitte eine Adresse hinterlegen, damit die Karte angezeigt wird.
        </div>
      </section>
    );
  }

  const z = Math.max(1, Math.min(20, zoom || 15));
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&z=${z}&hl=${locale}&output=embed`;

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-8 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div
          className={`overflow-hidden border border-[var(--color-border)] shadow-sm ${
            rounded ? "rounded-2xl" : ""
          }`}
          style={{ height: `${Math.max(200, Math.min(900, height || 420))}px` }}
        >
          <iframe
            src={src}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || `Karte: ${address}`}
          />
        </div>
        <p className="mt-3 text-center text-sm flex flex-wrap justify-center gap-x-6 gap-y-1">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            {t("In Google Maps öffnen", locale)} ↗
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              address
            )}&travelmode=transit`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline"
          >
            {t("Mit Öffentlichen (BVG)", locale)} ↗
          </a>
        </p>
      </div>
    </section>
  );
}
