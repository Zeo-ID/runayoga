"use client";

import siteData from "../../data/site.json";

export function Footer() {
  const contact = siteData.contact as Record<string, string | undefined>;
  const legal = siteData.footer?.legal || [];

  return (
    <footer style={{ background: "#2a2a2a", color: "rgba(255,255,255,.7)", padding: "4rem 0 2rem" }}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div
          className="grid gap-12 mb-12"
          style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}
        >
          {/* Brand */}
          <div>
            {siteData.logo && (
              <img
                src={siteData.logo}
                alt={siteData.name}
                className="mb-4"
                style={{ height: 40, filter: "brightness(0) invert(1)" }}
              />
            )}
            {siteData.tagline && (
              <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".9rem", maxWidth: 280 }}>
                {siteData.tagline}
              </p>
            )}
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.6)",
                    fontSize: "1rem",
                    transition: "background var(--transition), color var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,.6)";
                  }}
                >
                  IG
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.6)",
                    fontSize: ".8rem",
                    transition: "background var(--transition), color var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,.6)";
                  }}
                >
                  WA
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-heading mb-5"
              style={{ fontSize: "1.15rem", fontWeight: 500, color: "#fff" }}
            >
              Kontakt
            </h4>
            <div className="space-y-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="block"
                  style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)", transition: "color var(--transition)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                >
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="block"
                  style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)", transition: "color var(--transition)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                >
                  {contact.phone}
                </a>
              )}
              {contact.address && (
                <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)" }}>{contact.address}</p>
              )}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="font-heading mb-5"
              style={{ fontSize: "1.15rem", fontWeight: 500, color: "#fff" }}
            >
              Rechtliches
            </h4>
            <div className="space-y-2">
              {legal.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block"
                  style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)", transition: "color var(--transition)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="text-center pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,.08)", fontSize: ".82rem", color: "rgba(255,255,255,.4)" }}
        >
          <p>{siteData.footer?.copyright}</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          footer > div > .grid[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          footer > div > .grid[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
