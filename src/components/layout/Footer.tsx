"use client";

import siteData from "../../data/site.json";

export function Footer() {
  const contact = siteData.contact as Record<string, string | undefined>;
  const legal = siteData.footer?.legal || [];
  const nav = siteData.navigation || [];

  const socialStyle = {
    width: 42, height: 42, borderRadius: "50%",
    background: "rgba(255,255,255,.08)",
    color: "rgba(255,255,255,.75)",
    fontSize: ".82rem", fontWeight: 500,
    transition: "background var(--transition), color var(--transition), transform var(--transition)",
  } as const;

  return (
    <footer style={{ background: "var(--color-olive)", color: "rgba(255,255,255,.7)", position: "relative", overflow: "hidden" }}>
      {/* Oversized wordmark watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "-3rem", right: "-1rem", fontFamily: "Fraunces, serif",
          fontStyle: "italic", fontSize: "clamp(6rem, 18vw, 16rem)", lineHeight: 1,
          color: "rgba(255,255,255,.04)", pointerEvents: "none", whiteSpace: "nowrap",
        }}
      >
        {siteData.name}
      </div>

      <div className="container px-6 md:px-8" style={{ position: "relative", padding: "5rem 1.5rem 2.5rem" }}>
        <div className="grid gap-12 mb-14" style={{ gridTemplateColumns: "1.4fr 1fr 1fr 1fr" }}>
          {/* Brand */}
          <div>
            {siteData.logo ? (
              <img src={siteData.logo} alt={siteData.name} className="mb-5" style={{ height: 42, filter: "brightness(0) invert(1)" }} />
            ) : (
              <div className="mb-4" style={{ fontFamily: "Fraunces, serif", fontSize: "1.7rem", fontWeight: 500, color: "#fff" }}>{siteData.name}</div>
            )}
            {siteData.tagline && (
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".95rem", maxWidth: 300, lineHeight: 1.6 }}>{siteData.tagline}</p>
            )}
            <div className="flex gap-3 mt-6">
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center" style={socialStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.75)"; e.currentTarget.style.transform = "none"; }}>IG</a>
              )}
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center" style={socialStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.75)"; e.currentTarget.style.transform = "none"; }}>WA</a>
              )}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="footer-h">Entdecken</h4>
            <div className="flex flex-col gap-2">
              {nav.slice(0, 6).map((item, i) => (
                <a key={i} href={item.href} className="footer-link">{item.label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-h">Kontakt</h4>
            <div className="flex flex-col gap-2">
              {contact.email && <a href={`mailto:${contact.email}`} className="footer-link">{contact.email}</a>}
              {contact.phone && <a href={`tel:${contact.phone}`} className="footer-link">{contact.phone}</a>}
              {contact.address && <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{contact.address}</p>}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-h">Rechtliches</h4>
            <div className="flex flex-col gap-2">
              {legal.map((item, i) => (
                <a key={i} href={item.href} className="footer-link">{item.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,.12)", fontSize: ".82rem", color: "rgba(255,255,255,.45)" }}>
          <p>{siteData.footer?.copyright}</p>
          <p style={{ fontStyle: "italic", fontFamily: "Fraunces, serif" }}>Mit Achtsamkeit gemacht in Berlin-Pankow.</p>
        </div>
      </div>

      <style>{`
        .footer-h { font-family: "Fraunces", serif; font-size: 1.1rem; font-weight: 500; color: #fff; margin-bottom: 1.1rem; }
        .footer-link { font-size: .9rem; color: rgba(255,255,255,.6); transition: color var(--transition), padding-left var(--transition); }
        .footer-link:hover { color: #fff; padding-left: 4px; }
        @media (max-width: 968px) { footer .grid[style*="grid-template-columns"] { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { footer .grid[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 2.2rem !important; } }
      `}</style>
    </footer>
  );
}
