# Runayoga — Tina CMS + Astro Migration Design

**Datum:** 2026-03-12
**Status:** Approved

## Zusammenfassung

Migration der bestehenden statischen HTML-Website zu Astro + TinaCMS, damit die Kundin (Runa, nicht-technisch) alle Inhalte selbst über ein Admin-Panel bearbeiten kann.

## Entscheidungen

- **Framework:** Astro (SSG, leichtgewichtig, nah am bestehenden HTML)
- **CMS:** TinaCMS mit Tina Cloud (kostenlos bis 2 User)
- **Scope:** Alle Inhalte editierbar (Texte, Bilder, Blog, Preise, Kontaktdaten)
- **Editor:** Runa (nicht-technisch) über `/admin` Panel
- **Hosting:** Cloudflare Pages (wie bisher)

## Architektur

```
runayoga/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro        # <html>, <head>, CSS, fonts
│   │   ├── PageLayout.astro        # Page-Hero + Breadcrumb wrapper
│   │   ├── DetailLayout.astro      # Angebotsdetail-Seiten
│   │   └── BlogLayout.astro        # Blog-Post Layout
│   ├── components/
│   │   ├── Header.astro            # Nav (migriert aus components.js)
│   │   ├── Footer.astro            # Footer (migriert aus components.js)
│   │   ├── ServiceCard.astro       # Wiederverwendbare Service-Karte
│   │   ├── PricingCard.astro       # Preiskarte
│   │   └── TestimonialCard.astro   # Testimonial-Karte
│   ├── pages/
│   │   ├── index.astro             # Home (liest content/home.md)
│   │   ├── angebote.astro          # Übersicht
│   │   ├── [slug].astro            # Dynamisch: yoga, pilates, etc.
│   │   ├── ueber-mich.astro
│   │   ├── retreat.astro
│   │   ├── preise.astro
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog-Übersicht
│   │   │   └── [slug].astro        # Blog-Posts dynamisch
│   │   ├── kontakt.astro
│   │   ├── impressum.astro
│   │   └── datenschutz.astro
│   └── content/                    # Tina-managed Markdown
│       ├── home.md
│       ├── pages/
│       │   ├── angebote.md
│       │   ├── ueber-mich.md
│       │   ├── retreat.md
│       │   ├── preise.md
│       │   ├── kontakt.md
│       │   ├── impressum.md
│       │   └── datenschutz.md
│       ├── angebote/
│       │   ├── yoga.md
│       │   ├── pilates.md
│       │   ├── massagen.md
│       │   ├── heilraum.md
│       │   ├── mantra.md
│       │   └── jahreskreis.md
│       └── blog/
│           ├── yoga-im-alltag.md
│           ├── atemtechnik-pranayama.md
│           └── retreat-erfahrung.md
├── tina/
│   └── config.ts                   # Tina Schema (Collections + Fields)
├── public/
│   ├── images/                     # Bilder (unverändert)
│   └── favicon.svg
├── astro.config.mjs
└── package.json
```

## Tina CMS Collections

| Collection | Pfad | Felder |
|---|---|---|
| `home` | `content/home.md` | hero_title, hero_subtitle, hero_cta, philosophy_quote, about_teaser, retreat_teaser, testimonials[] |
| `pages` | `content/pages/*.md` | title, subtitle, body (rich-text), seo_description |
| `angebote` | `content/angebote/*.md` | title, subtitle, description (rich-text), highlights[], pricing_teaser, seo_description |
| `blog` | `content/blog/*.md` | title, date, author, excerpt, body (rich-text), seo_description |
| `preise` | `content/preise.md` | sections[]: { title, cards[]: { name, price, features[], featured } } |
| `site` | `content/site.md` | name, email, phone, address, instagram, opening_hours |

## Datenfluss

### Produktion
```
Runa öffnet /admin → Tina Cloud Editor
  → Ändert Text/Bild → Tina committed nach GitHub
    → Cloudflare Pages baut automatisch (Astro SSG)
      → Neue statische Seite live in ~30 Sekunden
```

### Lokal
```
npx tinacms dev -c "astro dev"
  → Änderungen direkt in Markdown-Dateien
    → Live-Preview im Browser
```

## Migration

1. HTML-Inhalte → Markdown-Dateien extrahieren
2. HTML-Struktur → Astro-Layouts mit Slots
3. `js/components.js` → `Header.astro` + `Footer.astro` (statisch, kein JS)
4. `css/styles.css` → unverändert, Import in BaseLayout
5. Bilder → `public/images/` unverändert

## Was gleich bleibt

- CSS — komplett unverändert
- Design — identisch (warm-organisch, Sage/Cream)
- SEO — Meta-Tags, sitemap.xml, robots.txt, JSON-LD
- Security Headers — `_headers` bleibt
- URL-Struktur — gleiche Pfade

## Deployment

- **Build:** `npx tinacms build && astro build`
- **Output:** `dist/`
- **Cloudflare Pages:** Build-Command + Output-Dir anpassen
- **Tina Cloud:** Projekt registrieren, Client-ID als Env-Variable

## Quellen

- [Astro + Tina Setup Guide](https://tina.io/docs/frameworks/astro)
- [Tina CMS & Astro (Astro Docs)](https://docs.astro.build/en/guides/cms/tina-cms/)
- [TinaCMS Content Modeling](https://tina.io/docs/schema)
- [tina-astro-starter](https://github.com/tinacms/tina-astro-starter)
