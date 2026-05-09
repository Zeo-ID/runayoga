"use client";

import { useEffect, useState } from "react";
import { loadContent, saveContent } from "../../lib/github";

type Contact = {
  email?: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
  instagram?: string;
};

type OpeningHour = { day: string; time: string };

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

type LegalLink = { label: string; href: string };

type Theme = {
  preset?: string;
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
};

type SiteData = {
  name: string;
  tagline: string;
  url?: string;
  logo?: string;
  ogImage?: string;
  contact: Contact;
  openingHours: OpeningHour[];
  theme: Theme;
  navigation: NavItem[];
  github?: { owner: string; repo: string; branch?: string };
  footer: { legal: LegalLink[]; copyright: string };
};

const SITE_FILE = "src/data/site.json";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </span>
      {children}
      {hint && <span className="block mt-1 text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40";

export function SiteSettings() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await loadContent(SITE_FILE);
      if (result?.content) setSite(result.content as SiteData);
      setLoading(false);
    }
    load();
  }, []);

  function patch<K extends keyof SiteData>(key: K, value: SiteData[K]) {
    if (!site) return;
    setSite({ ...site, [key]: value });
    setDirty(true);
  }

  async function save() {
    if (!site) return;
    setSaving(true);
    setMessage("");
    const ok = await saveContent(
      SITE_FILE,
      site,
      "Einstellungen aktualisiert"
    );
    setSaving(false);
    setMessage(ok ? "Gespeichert! Build startet…" : "Fehler beim Speichern");
    if (ok) {
      setDirty(false);
      setTimeout(() => setMessage(""), 5000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        Laden…
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        site.json konnte nicht geladen werden.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Einstellungen</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm ${
                message.includes("Fehler") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-lg bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Speichere…" : dirty ? "Speichern" : "Gespeichert"}
          </button>
        </div>
      </div>

      {/* Allgemein */}
      <Section
        title="Allgemein"
        description="Name, Slogan und Domain der Webseite."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              className={inputCls}
              value={site.name || ""}
              onChange={(e) => patch("name", e.target.value)}
            />
          </Field>
          <Field label="Domain (URL)" hint="z.B. https://meinedomain.de">
            <input
              className={inputCls}
              value={site.url || ""}
              onChange={(e) => patch("url", e.target.value)}
            />
          </Field>
          <Field label="Slogan / Tagline">
            <input
              className={inputCls}
              value={site.tagline || ""}
              onChange={(e) => patch("tagline", e.target.value)}
            />
          </Field>
          <Field label="Logo (Pfad oder URL)" hint="z.B. /images/logo.png">
            <input
              className={inputCls}
              value={site.logo || ""}
              onChange={(e) => patch("logo", e.target.value)}
            />
          </Field>
          <Field label="Social-Sharing-Bild" hint="für Facebook/Twitter Vorschau">
            <input
              className={inputCls}
              value={site.ogImage || ""}
              onChange={(e) => patch("ogImage", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* Kontakt */}
      <Section title="Kontakt" description="Wird auf der Kontakt-Seite und im Footer angezeigt.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="E-Mail">
            <input
              type="email"
              className={inputCls}
              value={site.contact?.email || ""}
              onChange={(e) =>
                patch("contact", { ...site.contact, email: e.target.value })
              }
            />
          </Field>
          <Field label="Telefon">
            <input
              className={inputCls}
              value={site.contact?.phone || ""}
              onChange={(e) =>
                patch("contact", { ...site.contact, phone: e.target.value })
              }
            />
          </Field>
          <Field label="Adresse" hint="Stadtteil oder ganze Adresse">
            <input
              className={inputCls}
              value={site.contact?.address || ""}
              onChange={(e) =>
                patch("contact", { ...site.contact, address: e.target.value })
              }
            />
          </Field>
          <Field label="WhatsApp" hint="Nur Ziffern, z.B. 4901631391059">
            <input
              className={inputCls}
              value={site.contact?.whatsapp || ""}
              onChange={(e) =>
                patch("contact", { ...site.contact, whatsapp: e.target.value })
              }
            />
          </Field>
          <Field label="Instagram-URL">
            <input
              className={inputCls}
              value={site.contact?.instagram || ""}
              onChange={(e) =>
                patch("contact", { ...site.contact, instagram: e.target.value })
              }
            />
          </Field>
        </div>
      </Section>

      {/* Öffnungszeiten */}
      <Section title="Öffnungszeiten">
        <div className="space-y-2">
          {(site.openingHours || []).map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputCls} w-40`}
                placeholder="Tag (z.B. Mo–Fr)"
                value={h.day}
                onChange={(e) => {
                  const next = [...site.openingHours];
                  next[i] = { ...next[i], day: e.target.value };
                  patch("openingHours", next);
                }}
              />
              <input
                className={`${inputCls} flex-1`}
                placeholder="Zeit (z.B. 9:00–20:00)"
                value={h.time}
                onChange={(e) => {
                  const next = [...site.openingHours];
                  next[i] = { ...next[i], time: e.target.value };
                  patch("openingHours", next);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const next = site.openingHours.filter((_, j) => j !== i);
                  patch("openingHours", next);
                }}
                className="text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded"
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch("openingHours", [
                ...(site.openingHours || []),
                { day: "", time: "" },
              ])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Zeile hinzufügen
          </button>
        </div>
      </Section>

      {/* Theme */}
      <Section title="Design" description="Farben und Schriftarten der Webseite.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Primärfarbe">
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-14 rounded border border-neutral-300 cursor-pointer"
                value={site.theme?.primaryColor || "#7a8b6f"}
                onChange={(e) =>
                  patch("theme", { ...site.theme, primaryColor: e.target.value })
                }
              />
              <input
                className={inputCls}
                value={site.theme?.primaryColor || ""}
                onChange={(e) =>
                  patch("theme", { ...site.theme, primaryColor: e.target.value })
                }
              />
            </div>
          </Field>
          <Field label="Akzentfarbe">
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-14 rounded border border-neutral-300 cursor-pointer"
                value={site.theme?.accentColor || "#c4956a"}
                onChange={(e) =>
                  patch("theme", { ...site.theme, accentColor: e.target.value })
                }
              />
              <input
                className={inputCls}
                value={site.theme?.accentColor || ""}
                onChange={(e) =>
                  patch("theme", { ...site.theme, accentColor: e.target.value })
                }
              />
            </div>
          </Field>
          <Field label="Schrift Überschriften">
            <input
              className={inputCls}
              value={site.theme?.fontHeading || ""}
              onChange={(e) =>
                patch("theme", { ...site.theme, fontHeading: e.target.value })
              }
            />
          </Field>
          <Field label="Schrift Fließtext">
            <input
              className={inputCls}
              value={site.theme?.fontBody || ""}
              onChange={(e) =>
                patch("theme", { ...site.theme, fontBody: e.target.value })
              }
            />
          </Field>
        </div>
      </Section>

      {/* Navigation */}
      <Section
        title="Navigation"
        description="Hauptmenü der Webseite. Untermenüs sind möglich."
      >
        <div className="space-y-3">
          {(site.navigation || []).map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Beschriftung"
                  value={item.label}
                  onChange={(e) => {
                    const next = [...site.navigation];
                    next[i] = { ...next[i], label: e.target.value };
                    patch("navigation", next);
                  }}
                />
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Link (z.B. /angebote)"
                  value={item.href}
                  onChange={(e) => {
                    const next = [...site.navigation];
                    next[i] = { ...next[i], href: e.target.value };
                    patch("navigation", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...site.navigation];
                    next[i] = i > 0 ? { ...next[i - 1] } : next[i];
                    if (i > 0) {
                      next[i - 1] = { ...site.navigation[i] };
                    }
                    patch("navigation", next);
                  }}
                  disabled={i === 0}
                  title="Nach oben"
                  className="text-neutral-600 px-2 py-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (i >= site.navigation.length - 1) return;
                    const next = [...site.navigation];
                    const tmp = next[i + 1];
                    next[i + 1] = next[i];
                    next[i] = tmp;
                    patch("navigation", next);
                  }}
                  disabled={i >= site.navigation.length - 1}
                  title="Nach unten"
                  className="text-neutral-600 px-2 py-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = site.navigation.filter((_, j) => j !== i);
                    patch("navigation", next);
                  }}
                  className="text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded"
                >
                  Entfernen
                </button>
              </div>

              {/* Children */}
              {(item.children || []).length > 0 && (
                <div className="ml-6 space-y-2 pt-2 border-t border-neutral-200">
                  {item.children!.map((child, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <span className="text-neutral-400 text-sm">↳</span>
                      <input
                        className={`${inputCls} flex-1`}
                        placeholder="Beschriftung"
                        value={child.label}
                        onChange={(e) => {
                          const next = [...site.navigation];
                          const children = [...(next[i].children || [])];
                          children[ci] = { ...children[ci], label: e.target.value };
                          next[i] = { ...next[i], children };
                          patch("navigation", next);
                        }}
                      />
                      <input
                        className={`${inputCls} flex-1`}
                        placeholder="Link"
                        value={child.href}
                        onChange={(e) => {
                          const next = [...site.navigation];
                          const children = [...(next[i].children || [])];
                          children[ci] = { ...children[ci], href: e.target.value };
                          next[i] = { ...next[i], children };
                          patch("navigation", next);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...site.navigation];
                          const children = (next[i].children || []).filter(
                            (_, j) => j !== ci
                          );
                          next[i] = { ...next[i], children };
                          patch("navigation", next);
                        }}
                        className="text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded"
                      >
                        Entfernen
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const next = [...site.navigation];
                  const children = [...(next[i].children || [])];
                  children.push({ label: "", href: "" });
                  next[i] = { ...next[i], children };
                  patch("navigation", next);
                }}
                className="text-xs text-blue-600 hover:underline ml-6"
              >
                + Untermenü-Eintrag
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch("navigation", [
                ...(site.navigation || []),
                { label: "", href: "" },
              ])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Menüeintrag
          </button>
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Field label="Copyright-Hinweis">
          <input
            className={inputCls}
            value={site.footer?.copyright || ""}
            onChange={(e) =>
              patch("footer", {
                ...(site.footer || { legal: [], copyright: "" }),
                copyright: e.target.value,
              })
            }
          />
        </Field>

        <div>
          <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
            Rechtliche Links
          </span>
          <div className="space-y-2">
            {(site.footer?.legal || []).map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Beschriftung (z.B. Impressum)"
                  value={link.label}
                  onChange={(e) => {
                    const legal = [...(site.footer?.legal || [])];
                    legal[i] = { ...legal[i], label: e.target.value };
                    patch("footer", {
                      copyright: site.footer?.copyright || "",
                      legal,
                    });
                  }}
                />
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Link (z.B. /impressum)"
                  value={link.href}
                  onChange={(e) => {
                    const legal = [...(site.footer?.legal || [])];
                    legal[i] = { ...legal[i], href: e.target.value };
                    patch("footer", {
                      copyright: site.footer?.copyright || "",
                      legal,
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const legal = (site.footer?.legal || []).filter(
                      (_, j) => j !== i
                    );
                    patch("footer", {
                      copyright: site.footer?.copyright || "",
                      legal,
                    });
                  }}
                  className="text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded"
                >
                  Entfernen
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                patch("footer", {
                  copyright: site.footer?.copyright || "",
                  legal: [
                    ...(site.footer?.legal || []),
                    { label: "", href: "" },
                  ],
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              + Link hinzufügen
            </button>
          </div>
        </div>
      </Section>

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Speichere…" : "Änderungen speichern"}
          </button>
        </div>
      )}
    </div>
  );
}
