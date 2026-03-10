# Runayoga Website Redesign - Design Document

**Date:** 2026-03-10
**Status:** Approved

## Summary

Complete redesign of runayoga.de — a yoga, pilates & massage studio website in Berlin-Pankow. Multi-page, plain HTML/CSS, warm-organic design aesthetic. Deploy to Cloudflare Pages with temporary `runayoga.pages.dev` domain.

## Architecture

### Option Chosen: Shared CSS + Shared Header/Footer via JS

- One `css/styles.css` for all pages
- `js/components.js` renders shared header/footer via `insertAdjacentHTML`
- No build step, no dependencies
- Blog posts as static HTML files

### File Structure

```
runayoga/
├── index.html              # Home
├── angebote.html           # Angebots-Übersicht
├── yoga.html               # Yoga Detail
├── pilates.html            # Pilates Detail
├── massagen.html           # Massagen Detail
├── heilraum.html           # Heilraum Detail
├── mantra.html             # Mantra singen Detail
├── jahreskreis.html        # Jahreskreis Detail
├── ueber-mich.html         # Über mich
├── retreat.html            # Retreat
├── preise.html             # Preise & Tarife
├── blog.html               # Blog-Übersicht
├── kontakt.html            # Kontakt
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutz
├── css/
│   └── styles.css
├── js/
│   └── components.js
└── images/
    ├── logo.png
    ├── hero.jpg (compressed)
    ├── about.jpg (compressed)
    ├── retreat.jpg (compressed)
    └── favicon.svg
```

## Design: Warm-Organic

### Color Palette (kept from original)

- `--sage: #7a8b6f` (primary)
- `--sage-light: #9aab8f`
- `--sage-dark: #5a6b4f`
- `--cream: #f5f0e8` (background)
- `--warm-white: #faf8f5`
- `--sand: #d4c5a9`
- `--earth: #8b7355`
- `--accent: #c4956a`

### Typography

- Headings: Cormorant Garamond (serif)
- Body: Inter (sans-serif)

### Design Elements

- Organic blob-shapes via CSS border-radius
- Soft parallax on hero images
- Warm textures/gradients (not flat backgrounds)
- Micro-animations (hover effects, scroll-reveal)
- Rounded corners, soft shadows

### Pages (15 total)

1. **Home** — Hero with parallax, services teaser (6 cards), philosophy quote, testimonials, CTA
2. **Angebote** — Overview grid of 6 offerings with cards
3. **Yoga** — Detail page with description, schedule placeholder, CTA
4. **Pilates** — Detail page
5. **Massagen** — Detail page with massage types
6. **Heilraum** — Detail page (shamanic healing)
7. **Mantra** — Detail page (chanting/medicine songs)
8. **Jahreskreis** — Detail page (women's circle)
9. **Über mich** — Bio, philosophy, qualifications
10. **Retreat** — Retreat details, highlights, dates placeholder, CTA
11. **Preise** — Pricing tables/cards for all offerings
12. **Blog** — Overview with 2-3 placeholder articles
13. **Kontakt** — Contact info, map placeholder, form placeholder
14. **Impressum** — Legal notice with TODO placeholders
15. **Datenschutz** — Privacy policy with TODO placeholders

### Technical

- Images: compress to WebP where possible, lazy loading
- SEO: meta description, Open Graph tags, LocalBusiness structured data
- Favicon: SVG derived from logo
- Performance: font-display swap, critical CSS considerations
- No cookies, no analytics = no cookie banner needed

### Contact Data

- Email: runabulla@gmail.com
- WhatsApp: +49 163 139 1059
- Instagram: @runayoga (placeholder link until real profile confirmed)
- Location: Berlin-Pankow

### Deployment

- Platform: Cloudflare Pages (Free Tier)
- Domain: `runayoga.pages.dev` (temporary)
- Custom domain: later (runayoga.de not yet registered)
- Build: none (static files, output directory `/`)
