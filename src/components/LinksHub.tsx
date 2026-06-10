import siteData from "../data/site.json";
import { Glyph, mapsSearch, mapsTransit, type IconName } from "./icons";

const contact = siteData.contact as Record<string, string | undefined>;

type Row = { href: string; label: string; sub?: string; icon: IconName; external?: boolean };

const rows: (Row | null)[] = [
  contact.whatsapp ? { href: `https://wa.me/${contact.whatsapp}`, label: "WhatsApp", sub: "Schreib mir direkt", icon: "whatsapp", external: true } : null,
  contact.phone ? { href: `tel:${contact.phone}`, label: "Anrufen", sub: contact.phone, icon: "phone" } : null,
  contact.instagram ? { href: contact.instagram, label: "Instagram", sub: "@runayoga_berlin", icon: "instagram", external: true } : null,
  contact.facebook ? { href: contact.facebook, label: "Facebook", icon: "facebook", external: true } : null,
  contact.telegram ? { href: contact.telegram, label: "Telegram", icon: "telegram", external: true } : null,
  contact.email ? { href: `mailto:${contact.email}`, label: "E-Mail schreiben", sub: contact.email, icon: "mail" } : null,
  contact.address ? { href: mapsSearch(contact.address), label: "Anfahrt & Adresse", sub: contact.address, icon: "map", external: true } : null,
  contact.address ? { href: mapsTransit(contact.address), label: "Öffentliche Verkehrsmittel (BVG)", sub: "Route mit Bus & Bahn", icon: "transit", external: true } : null,
  { href: "/preise", label: "Kurse & Preise", icon: "cal" },
  { href: "/blog", label: "Blog lesen", icon: "news" },
  { href: "/", label: "Zur Website", icon: "web" },
];

export function LinksHub() {
  const allRows = rows.filter(Boolean) as Row[];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #f7f1e8 0%, #ece0d1 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 18px 64px",
        position: "relative",
      }}
    >
      {/* organische Akzentform */}
      <div aria-hidden="true" style={{ position: "absolute", top: -90, right: -70, width: 320, height: 320, borderRadius: "50%", background: "rgba(217,169,143,.25)", filter: "blur(8px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/" aria-label={siteData.name}>
            {siteData.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={siteData.logo} alt={siteData.name} style={{ height: 56, width: "auto", margin: "0 auto" }} />
            ) : (
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "2rem", color: "var(--color-text)" }}>{siteData.name}</span>
            )}
          </a>
          <p style={{ color: "var(--color-text-light)", fontSize: ".98rem", marginTop: 14, lineHeight: 1.5 }}>
            {siteData.tagline}
          </p>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {allRows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="lh-row"
            >
              <span className="lh-ic"><Glyph icon={r.icon} size={21} /></span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>{r.label}</span>
                {r.sub && (
                  <span style={{ fontSize: ".8rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.sub}
                  </span>
                )}
              </span>
              <span style={{ marginInlineStart: "auto", color: "var(--color-primary)", fontSize: "1.1rem" }} aria-hidden>→</span>
            </a>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: ".8rem", color: "var(--color-text-muted)", fontFamily: "Fraunces, serif", fontStyle: "italic" }}>
          © 2026 Runayoga · Berlin-Pankow
        </p>
      </div>

      <style>{`
        .lh-row {
          display: flex; align-items: center; gap: 14px;
          background: #fff; border: 1px solid var(--color-border);
          border-radius: 16px; padding: 15px 18px; text-decoration: none;
          box-shadow: 0 6px 18px rgba(72,45,28,.05);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .lh-row:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(72,45,28,.13); border-color: var(--color-rose); }
        .lh-ic {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
          background: var(--color-rose-soft); color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          transition: background .18s ease, color .18s ease;
        }
        .lh-row:hover .lh-ic { background: var(--color-primary); color: #fff; }
      `}</style>
    </div>
  );
}
