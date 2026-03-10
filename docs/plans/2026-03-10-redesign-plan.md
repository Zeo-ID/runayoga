# Runayoga Website Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete redesign of the Runayoga yoga studio website as a warm-organic multi-page static site, deployed to Cloudflare Pages.

**Architecture:** Plain HTML/CSS multi-page site. Shared `css/styles.css` for all pages. `js/components.js` injects header/footer via `insertAdjacentHTML` so nav changes only require editing one file. Blog posts are static HTML. No build step, no dependencies.

**Tech Stack:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JS, Cloudflare Pages, Google Fonts (Cormorant Garamond + Inter)

---

### Task 1: Project Scaffolding & Shared CSS

**Files:**
- Create: `css/styles.css`
- Create: `js/components.js`
- Create: `images/favicon.svg`
- Delete content of: `index.html` (will be rewritten)

**Step 1: Create directory structure**

```bash
cd /home/moe/runayoga
mkdir -p css js
```

**Step 2: Create `css/styles.css` with CSS reset, custom properties, typography, shared layout classes**

Complete CSS file containing:
- CSS Custom Properties (color palette from design doc)
- Reset & base styles
- Typography (Cormorant Garamond headings, Inter body)
- Nav styles (fixed, blur backdrop, hamburger mobile menu)
- Hero styles (parallax-ready)
- Section shared styles (section-header, section-label, fade-in)
- Card styles (service cards, testimonial cards, blog cards, pricing cards)
- Button styles (btn-primary, btn-outline, btn-accent)
- Grid layouts (services-grid, testimonials-grid, blog-grid, pricing-grid)
- Page-specific layouts (about, retreat, contact, detail pages)
- Footer styles
- Organic blob decorations (CSS border-radius shapes)
- Responsive breakpoints (968px, 600px)
- Animations (fade-in, scroll-reveal, hover micro-animations)
- Utility classes

**Step 3: Create `js/components.js`**

Contains:
- `renderHeader()` — injects nav HTML into `<header id="site-header">` placeholder
- `renderFooter()` — injects footer HTML into `<footer id="site-footer">` placeholder
- Nav scroll effect (add `.scrolled` class on scroll > 50px)
- Hamburger toggle
- Close mobile menu on link click
- Active nav link highlighting based on current page
- Scroll animations (IntersectionObserver for `.fade-in` elements)
- Smooth scroll for anchor links

**Step 4: Create `images/favicon.svg`**

Simple SVG favicon — a sage-green lotus/leaf shape matching the brand.

**Step 5: Compress existing images**

```bash
# Install image tools if needed
# Compress hero.jpg, about.jpg, retreat.jpg
# Target: hero <150KB, about <200KB, retreat <250KB
```

**Step 6: Commit**

```bash
git add css/ js/ images/favicon.svg
git commit -m "feat: project scaffolding — shared CSS, components.js, favicon"
```

---

### Task 2: Home Page (`index.html`)

**Files:**
- Rewrite: `index.html`

**Step 1: Build `index.html`**

Sections:
1. `<header id="site-header"></header>` — placeholder for components.js
2. **Hero** — full-viewport, parallax background, h1 "Finde deine innere Harmonie", subtitle, 2 CTAs (Angebot entdecken → `/angebote.html`, Termin → `/kontakt.html`)
3. **Services Teaser** — 6 cards linking to detail pages (`/yoga.html` etc.), organic blob decorations
4. **Philosophy Quote** — dark sage background, Bhagavad Gita quote
5. **About Teaser** — image + short text + "Mehr erfahren" → `/ueber-mich.html`
6. **Retreat Teaser** — image + highlights + CTA → `/retreat.html`
7. **Testimonials** — 3 cards (placeholder reviews)
8. **CTA Section** — "Bereit für deine Reise?" + contact buttons
9. `<footer id="site-footer"></footer>` — placeholder for components.js
10. `<script src="js/components.js"></script>`

**Step 2: Test locally**

```bash
cd /home/moe/runayoga && python3 -m http.server 8080 &
# Open http://localhost:8080 — verify all sections render
# Check mobile (resize browser to 375px width)
# Kill server after
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: home page redesign with hero, services teaser, testimonials"
```

---

### Task 3: Angebote Overview + 6 Detail Pages

**Files:**
- Create: `angebote.html`
- Create: `yoga.html`
- Create: `pilates.html`
- Create: `massagen.html`
- Create: `heilraum.html`
- Create: `mantra.html`
- Create: `jahreskreis.html`

**Step 1: Build `angebote.html`**

- Header/footer placeholders
- Hero banner (smaller, page-specific): "Mein Angebot"
- 6 service cards in a grid (same as home teaser but with more detail text)
- Each card links to its detail page
- Organic background shapes

**Step 2: Build detail page template**

All 6 detail pages follow the same structure:
1. Page hero (small) with title + breadcrumb
2. Description section (2-3 paragraphs of content about the offering)
3. "Was dich erwartet" highlights list
4. Schedule/availability placeholder
5. Pricing teaser + link to `/preise.html`
6. CTA → contact

Content for each page:
- **yoga.html**: Präventionskurse, Yin Yoga, Online-Yoga
- **pilates.html**: Zertifizierte Präventionskurse, Körpermitte
- **massagen.html**: Wohlfühl-Massagen, Pre-/Postnatal Pakete
- **heilraum.html**: Schamanische Energiemedizin, spirituelle Begleitung
- **mantra.html**: Mantrachanting, Medicine Songs
- **jahreskreis.html**: Jahreskreis für Frauen, Rituale, Gemeinschaft

**Step 3: Commit**

```bash
git add angebote.html yoga.html pilates.html massagen.html heilraum.html mantra.html jahreskreis.html
git commit -m "feat: angebote overview + 6 detail pages"
```

---

### Task 4: Über mich, Retreat, Preise

**Files:**
- Create: `ueber-mich.html`
- Create: `retreat.html` (new file, not the old section)
- Create: `preise.html`

**Step 1: Build `ueber-mich.html`**

- Page hero with "Über mich"
- Large about image
- Bio text (from existing content + expanded)
- Qualifications/certifications section
- Philosophy section
- CTA → contact

**Step 2: Build `retreat.html`**

- Page hero with retreat image
- Retreat description
- Highlights list (daily yoga, shamanic ceremonies, mantrachanting, small groups)
- Dates placeholder: "Termine 2026 — coming soon"
- Location info placeholder
- Pricing teaser
- CTA → contact for inquiry

**Step 3: Build `preise.html`**

- Page hero "Preise & Pakete"
- Pricing cards/tables for each offering:
  - Yoga (Einzelstunde, 5er-Karte, 10er-Karte, Präventionskurs)
  - Pilates (same structure)
  - Massagen (30min, 60min, 90min, Pre-/Postnatal)
  - Heilraum (Einzelsitzung, Paket)
  - Mantra (Einzeltermin, Abo)
  - Jahreskreis (pro Kreis)
  - Retreat (Frühbucher, Regular)
- All prices as `[Preis auf Anfrage]` placeholders
- CTA → contact

**Step 4: Commit**

```bash
git add ueber-mich.html retreat.html preise.html
git commit -m "feat: über mich, retreat, preise pages"
```

---

### Task 5: Blog, Kontakt

**Files:**
- Create: `blog.html`
- Create: `blog/` directory with 2-3 placeholder posts
- Create: `kontakt.html`

**Step 1: Build `blog.html`**

- Page hero "Blog & Aktuelles"
- Blog card grid (image, date, title, excerpt, read-more link)
- 2-3 placeholder articles

**Step 2: Create placeholder blog posts**

- `blog/yoga-im-alltag.html` — "5 Wege, Yoga in deinen Alltag zu integrieren"
- `blog/atemtechnik-pranayama.html` — "Die Kraft der Atemtechnik: Pranayama für Anfänger"
- `blog/retreat-erfahrung.html` — "Mein erstes Retreat: Eine Reise zu mir selbst"

Each post: header, title, date, author, content (placeholder text), back-to-blog link, related posts.

**Step 3: Build `kontakt.html`**

- Page hero "Kontakt"
- Contact info (Email, WhatsApp, Phone, Instagram)
- Location: Berlin-Pankow (map placeholder div)
- Opening hours placeholder
- CTA section

**Step 4: Commit**

```bash
git add blog.html blog/ kontakt.html
git commit -m "feat: blog with 3 placeholder posts + kontakt page"
```

---

### Task 6: Impressum, Datenschutz

**Files:**
- Create: `impressum.html`
- Create: `datenschutz.html`

**Step 1: Build `impressum.html`**

Standard German Impressum template with TODO placeholders:
- Angaben gemäß § 5 TMG: `[Name]`, `[Adresse]`, `[Kontakt]`
- Umsatzsteuer-ID: `[falls vorhanden]`
- Verantwortlich für den Inhalt: `[Name]`
- Haftungsausschluss (standard text)
- Urheberrecht (standard text)

**Step 2: Build `datenschutz.html`**

Standard DSGVO Datenschutzerklärung with TODO placeholders:
- Verantwortlicher: `[Name, Adresse]`
- Hosting (Cloudflare Pages)
- Kontaktaufnahme (Email, WhatsApp)
- Google Fonts (external load disclosure)
- Keine Cookies, keine Analytics
- Betroffenenrechte (Art. 15-21 DSGVO)

**Step 3: Commit**

```bash
git add impressum.html datenschutz.html
git commit -m "feat: impressum + datenschutz with TODO placeholders"
```

---

### Task 7: SEO & Performance

**Files:**
- Modify: all `.html` files (add meta tags)
- Create: `robots.txt`
- Create: `sitemap.xml`

**Step 1: Add SEO meta tags to all pages**

Each page gets:
- `<meta name="description" content="...">`
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- `<link rel="canonical" href="...">`
- Canonical URLs use placeholder `https://runayoga.pages.dev/`

**Step 2: Create `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://runayoga.pages.dev/sitemap.xml
```

**Step 3: Create `sitemap.xml`**

List all 15 pages with lastmod date.

**Step 4: Add structured data to `index.html`**

JSON-LD `LocalBusiness` schema:
- name: Runayoga
- address: Berlin-Pankow
- contact: email, phone

**Step 5: Commit**

```bash
git add *.html robots.txt sitemap.xml
git commit -m "feat: SEO meta tags, robots.txt, sitemap, structured data"
```

---

### Task 8: Deploy to Cloudflare Pages

**Step 1: Deploy via Cloudflare API**

```bash
# Read Cloudflare token
CF_TOKEN=$(cat /home/moe/.cloudflare-token)
CF_ACCOUNT="9f08f4ee211f4edb8da5c87e81dbf2ef"

# Create Cloudflare Pages project connected to GitHub
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "runayoga",
    "production_branch": "main",
    "source": {
      "type": "github",
      "config": {
        "owner": "Zeo-ID",
        "repo_name": "runayoga",
        "production_branch": "main"
      }
    },
    "build_config": {
      "build_command": "",
      "destination_dir": "/",
      "root_dir": ""
    }
  }'
```

**Step 2: Push code to trigger deployment**

```bash
cd /home/moe/runayoga
git push origin main
```

**Step 3: Verify deployment**

```bash
# Check deployment status
curl -s "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/runayoga/deployments" \
  -H "Authorization: Bearer $CF_TOKEN" | jq '.result[0].url, .result[0].latest_stage'
```

**Step 4: Test live site**

```bash
curl -s -o /dev/null -w "%{http_code}" https://runayoga.pages.dev/
# Expected: 200
```

**Step 5: Add security headers**

Create `_headers` file for Cloudflare Pages:
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'
```

**Step 6: Commit and push headers**

```bash
git add _headers
git commit -m "feat: Cloudflare Pages security headers"
git push origin main
```

---

## Task Dependencies

```
Task 1 (scaffolding) → Task 2 (home) → Task 3 (angebote) → Task 4 (about/retreat/preise)
                                      → Task 5 (blog/kontakt)
                                      → Task 6 (impressum/datenschutz)
                                      → Task 7 (SEO)
                                                              → Task 8 (deploy)
```

Tasks 3-7 depend on Task 1+2 (shared CSS/JS must exist). Tasks 3-7 can run in parallel. Task 8 runs last.
