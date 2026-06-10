import siteData from "../../data/site.json";

/* ─── Inline glyphs (no deps) ─── */
function Glyph({ name }: { name: "mail" | "phone" | "pin" | "clock" | "wa" | "ig" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.5 3.5h3l1.3 4-2 1.3a12 12 0 0 0 5.1 5.1l1.3-2 4 1.3v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "wa":
      return (
        <svg {...common}>
          <path d="M4 20l1.4-4.1A8 8 0 1 1 8.1 18.6L4 20Z" />
          <path d="M9 9.2c.2 2.3 3.5 5.6 5.8 5.8.7.1 1.7-.9 1.7-1.6l-1.9-1-1 .9c-1.4-.6-2.3-1.5-2.9-2.9l.9-1-1-1.9c-.7 0-1.7 1-1.6 1.7Z" />
        </svg>
      );
    case "ig":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

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
  const hasMap = !!(showMap && mapEmbed);

  /* Primary contact rows (email / phone / address) */
  const rows: { glyph: "mail" | "phone" | "pin"; label: string; value: string; href?: string }[] = [];
  if (contact.email) rows.push({ glyph: "mail", label: "E-Mail", value: contact.email, href: `mailto:${contact.email}` });
  if (contact.phone) rows.push({ glyph: "phone", label: "Telefon", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` });
  if (contact.address) rows.push({ glyph: "pin", label: "Adresse", value: contact.address });

  return (
    <section className="relative overflow-hidden section-padding" id="kontakt">
      {/* organic background accents */}
      <div className="blob" aria-hidden="true" style={{ width: 460, height: 460, background: "rgba(217,169,143,.20)", top: -160, right: -130 }} />
      <div className="blob" aria-hidden="true" style={{ width: 360, height: 360, background: "rgba(63,69,52,.07)", bottom: -150, left: -120 }} />

      <div className="container relative z-10">
        {/* ── Editorial header ── */}
        <div style={{ maxWidth: 640 }}>
          <span className="kicker">✦ Kontakt</span>
          {title && (
            <h2 className="display-sm" style={{ marginTop: "1.2rem" }}>
              {title}
            </h2>
          )}
          {text && (
            <p
              style={{
                marginTop: "1.4rem",
                fontSize: "1.16rem",
                lineHeight: 1.66,
                color: "var(--color-text-light)",
                maxWidth: 540,
              }}
            >
              {text}
            </p>
          )}
        </div>

        {/* ── Asymmetric grid: contact info | map / hours ── */}
        <div
          className="ry-contact-grid"
          style={{
            marginTop: "clamp(2.6rem, 5vw, 4rem)",
            display: "grid",
            gridTemplateColumns: hasMap ? "minmax(0, .92fr) minmax(0, 1.08fr)" : "minmax(0, 1.05fr) minmax(0, .95fr)",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "stretch",
          }}
        >
          {/* LEFT — contact ways */}
          <div className="flex flex-col" style={{ gap: "1rem" }}>
            {rows.map((r, i) => {
              const Inner = (
                <>
                  <span className="ry-c-icon" aria-hidden="true">
                    <Glyph name={r.glyph} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: ".7rem",
                        letterSpacing: ".22em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {r.label}
                    </span>
                    <span
                      className="ry-c-value"
                      style={{
                        display: "block",
                        marginTop: ".2rem",
                        fontFamily: "Fraunces, serif",
                        fontSize: "1.18rem",
                        lineHeight: 1.3,
                        color: "var(--color-text)",
                        wordBreak: "break-word",
                      }}
                    >
                      {r.value}
                    </span>
                  </span>
                </>
              );
              const baseStyle: React.CSSProperties = {
                display: "flex",
                alignItems: "center",
                gap: "1.1rem",
                padding: "1.15rem 1.3rem",
                background: "var(--color-bg-cream)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-sm)",
                transition: "transform var(--transition), box-shadow var(--transition), border-color var(--transition)",
                textDecoration: "none",
              };
              return r.href ? (
                <a key={i} href={r.href} className="ry-c-card" style={baseStyle}>
                  {Inner}
                </a>
              ) : (
                <div key={i} className="ry-c-card ry-c-static" style={baseStyle}>
                  {Inner}
                </div>
              );
            })}

            {/* social pills */}
            {(contact.whatsapp || contact.instagram) && (
              <div className="flex flex-wrap" style={{ gap: ".8rem", marginTop: ".4rem" }}>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ry-c-pill"
                  >
                    <Glyph name="wa" /> WhatsApp
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ry-c-pill"
                  >
                    <Glyph name="ig" /> Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — map OR inviting hours panel */}
          {hasMap ? (
            <div className="relative">
              {/* offset terracotta frame for depth */}
              <div
                aria-hidden="true"
                className="absolute"
                style={{
                  inset: 0,
                  transform: "translate(16px, 16px)",
                  borderRadius: "var(--radius-lg)",
                  border: "1.5px solid var(--color-primary)",
                  opacity: 0.45,
                  pointerEvents: "none",
                }}
              />
              <div
                className="organic-img-soft relative"
                style={{
                  height: "100%",
                  minHeight: 360,
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-md)",
                  background: "var(--color-bg-cream)",
                }}
              >
                <iframe
                  src={mapEmbed}
                  className="w-full h-full border-0"
                  style={{ display: "block", minHeight: 360 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Karte"
                />
              </div>
            </div>
          ) : (
            <div
              className="bg-olive relative overflow-hidden"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "clamp(2rem, 4vw, 3rem)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* faint decorative ring */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(236,211,196,.22)",
                  top: -120,
                  right: -110,
                }}
              />
              <span
                className="kicker"
                style={{ color: "var(--color-rose)" }}
              >
                {hours && hours.length > 0 ? "Öffnungszeiten" : "Wir sind für dich da"}
              </span>

              {hours && hours.length > 0 ? (
                <div style={{ marginTop: "1.6rem", position: "relative", zIndex: 1 }}>
                  {hours.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        padding: "0.85rem 0",
                        borderBottom: i < hours.length - 1 ? "1px solid rgba(236,211,196,.18)" : "none",
                      }}
                    >
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: ".95rem", color: "rgba(243,235,225,.78)" }}>
                        {h.day}
                      </span>
                      <span
                        style={{
                          fontFamily: "Fraunces, serif",
                          fontSize: "1.22rem",
                          letterSpacing: "-.01em",
                          color: "var(--color-bg)",
                        }}
                      >
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="serif-italic"
                  style={{
                    marginTop: "1.4rem",
                    fontSize: "1.5rem",
                    lineHeight: 1.45,
                    color: "var(--color-bg)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Schreib uns oder ruf an — wir freuen uns, von dir zu hören und finden gemeinsam den passenden Termin.
                </p>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="ry-c-cta"
                  style={{ marginTop: "2rem", position: "relative", zIndex: 1 }}
                >
                  Nachricht schreiben
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ry-c-icon {
          flex: none;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--color-rose-soft);
          color: var(--color-primary-dark);
          transition: background var(--transition), color var(--transition), transform var(--transition);
        }
        .ry-c-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-rose);
        }
        a.ry-c-card:hover .ry-c-icon {
          background: var(--color-primary);
          color: #fff;
          transform: rotate(-6deg);
        }
        a.ry-c-card:hover .ry-c-value { color: var(--color-primary-dark); }
        .ry-c-static { cursor: default; }
        .ry-c-static:hover { transform: none; box-shadow: var(--shadow-sm); border-color: var(--color-border); }

        .ry-c-pill {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          padding: .62rem 1.1rem;
          border-radius: 100px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: .85rem;
          color: var(--color-text);
          background: transparent;
          border: 1.5px solid var(--color-border);
          text-decoration: none;
          transition: transform var(--transition), background var(--transition), color var(--transition), border-color var(--transition);
        }
        .ry-c-pill:hover {
          transform: translateY(-2px);
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }

        .ry-c-cta {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          padding: .85rem 1.7rem;
          border-radius: 100px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: .92rem;
          color: var(--color-olive);
          background: var(--color-bg-cream);
          border: 1.5px solid var(--color-bg-cream);
          text-decoration: none;
          transition: transform var(--transition), box-shadow var(--transition), background var(--transition), color var(--transition);
        }
        .ry-c-cta::after { content: "→"; transition: transform var(--transition); }
        .ry-c-cta:hover {
          transform: translateY(-3px);
          background: var(--color-rose);
          color: var(--color-olive);
          box-shadow: var(--shadow-md);
        }
        .ry-c-cta:hover::after { transform: translateX(4px); }

        @media (max-width: 860px) {
          .ry-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ry-c-card:hover, .ry-c-pill:hover, .ry-c-cta:hover, a.ry-c-card:hover .ry-c-icon {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
