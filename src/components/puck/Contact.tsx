import siteData from "../../data/site.json";

export function Contact({
  title,
  text,
  showMap,
  mapEmbed,
}: {
  title: string;
  text: string;
  showMap: boolean;
  mapEmbed: string;
}) {
  const contact = siteData.contact as Record<string, string | undefined>;
  const hours = siteData.openingHours;

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-4 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-center text-[var(--color-text-light)] mb-10 max-w-2xl mx-auto">
            {text}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {contact.email && (
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">E-Mail</h3>
                <a href={`mailto:${contact.email}`} className="text-[var(--color-primary)] hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">Telefon</h3>
                <a href={`tel:${contact.phone}`} className="text-[var(--color-primary)] hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.address && (
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">Adresse</h3>
                <p className="text-[var(--color-text-light)]">{contact.address}</p>
              </div>
            )}
            {hours && hours.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">Öffnungszeiten</h3>
                <div className="space-y-1">
                  {hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm text-[var(--color-text-light)] max-w-xs">
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4">
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline text-sm"
                >
                  WhatsApp
                </a>
              )}
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline text-sm"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>

          {showMap && mapEmbed && (
            <div className="rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] h-80">
              <iframe
                src={mapEmbed}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Karte"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
