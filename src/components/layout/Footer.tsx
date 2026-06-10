"use client";

import { usePathname } from "next/navigation";
import siteData from "../../data/site.json";
import { Glyph, type BrandIcon } from "../icons";
import { splitLocale, localizedHref } from "../../lib/i18n";
import { t } from "../../data/ui";

export function Footer() {
  const pathname = usePathname() || "/";
  const { locale, basePath } = splitLocale(pathname);
  const L = (href: string) => localizedHref(locale, href);
  const contact = siteData.contact as Record<string, string | undefined>;
  const legal = siteData.footer?.legal || [];
  const nav = siteData.navigation || [];

  if (basePath.startsWith("/links")) return null;

  const socials = [
    contact.instagram && { href: contact.instagram, icon: "instagram" as BrandIcon, label: "Instagram" },
    contact.whatsapp && { href: `https://wa.me/${contact.whatsapp}`, icon: "whatsapp" as BrandIcon, label: "WhatsApp" },
    contact.facebook && { href: contact.facebook, icon: "facebook" as BrandIcon, label: "Facebook" },
    contact.telegram && { href: contact.telegram, icon: "telegram" as BrandIcon, label: "Telegram" },
    contact.linkedin && { href: contact.linkedin, icon: "linkedin" as BrandIcon, label: "LinkedIn" },
  ].filter(Boolean) as { href: string; icon: BrandIcon; label: string }[];

  return (
    <footer style={{ background: "var(--color-olive)", color: "rgba(255,255,255,.7)", position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{ position: "absolute", bottom: "-3rem", right: "-1rem", fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "clamp(6rem, 18vw, 16rem)", lineHeight: 1, color: "rgba(255,255,255,.04)", pointerEvents: "none", whiteSpace: "nowrap" }}
      >
        {siteData.name}
      </div>

      <div className="container px-6 md:px-8" style={{ position: "relative", padding: "5rem 1.5rem 2.5rem" }}>
        <div className="grid gap-12 mb-14" style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1.1fr" }}>
          {/* Brand + Social */}
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
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                  <Glyph icon={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Entdecken */}
          <div>
            <h4 className="footer-h">{t("Entdecken", locale)}</h4>
            <div className="flex flex-col gap-2">
              {nav.slice(0, 6).map((item, i) => (
                <a key={i} href={L(item.href)} className="footer-link">{t(item.label, locale)}</a>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="footer-h">{t("Kontakt", locale)}</h4>
            <div className="flex flex-col gap-2">
              {contact.email && <a href={`mailto:${contact.email}`} className="footer-link">{contact.email}</a>}
              {contact.phone && <a href={`tel:${contact.phone}`} className="footer-link">{contact.phone}</a>}
              {contact.address && <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{contact.address}</p>}
            </div>
          </div>

          {/* Alle Wege zu mir (QR-Hub) */}
          <div>
            <h4 className="footer-h">{t("Alle Wege zu mir", locale)}</h4>
            <div className="flex items-start gap-4">
              <a href="/links" aria-label={t("Alle Links", locale)} style={{ background: "#fff", borderRadius: 14, padding: 9, lineHeight: 0, boxShadow: "0 10px 28px rgba(0,0,0,.22)", flexShrink: 0 }}>
                <img src="/images/qr-links.svg" alt="QR-Code" width={96} height={96} style={{ display: "block" }} />
              </a>
              <div>
                <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.6)", margin: "0 0 .85rem", lineHeight: 1.55 }}>
                  {t("Scanne den Code für WhatsApp, Instagram, Anfahrt & mehr.", locale)}
                </p>
                <a href="/links" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary)", color: "#fff", fontWeight: 600, padding: ".55rem 1.05rem", borderRadius: 50, textDecoration: "none", fontSize: ".82rem" }}>
                  {t("Alle Links", locale)} →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,.12)", fontSize: ".82rem", color: "rgba(255,255,255,.5)" }}>
          <p>
            {t(siteData.footer?.copyright || "", locale)}
            {legal.map((item, i) => (
              <span key={i}>
                {" · "}
                <a href={L(item.href)} className="footer-legal">{t(item.label, locale)}</a>
              </span>
            ))}
          </p>
          <p style={{ fontStyle: "italic", fontFamily: "Fraunces, serif" }}>{t("Mit Achtsamkeit gemacht in Berlin-Pankow.", locale)}</p>
        </div>
      </div>

      <style>{`
        .footer-h { font-family: "Fraunces", serif; font-size: 1.1rem; font-weight: 500; color: #fff; margin-bottom: 1.1rem; }
        .footer-link { font-size: .9rem; color: rgba(255,255,255,.6); transition: color var(--transition), padding-left var(--transition); }
        .footer-link:hover { color: #fff; padding-left: 4px; }
        .footer-legal { color: rgba(255,255,255,.55); transition: color var(--transition); }
        .footer-legal:hover { color: #fff; }
        .footer-social {
          width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.08); color: rgba(255,255,255,.75);
          transition: background var(--transition), color var(--transition), transform var(--transition);
        }
        .footer-social:hover { background: var(--color-primary); color: #fff; transform: translateY(-2px); }
        @media (max-width: 968px) { footer .grid[style*="grid-template-columns"] { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { footer .grid[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 2.2rem !important; } }
      `}</style>
    </footer>
  );
}
