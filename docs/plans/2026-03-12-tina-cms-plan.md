# Tina CMS + Astro Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the static HTML Runayoga website to Astro + TinaCMS so the site owner (Runa, non-technical) can edit all content via an admin panel at `/admin`.

**Architecture:** Astro SSG renders static HTML from Markdown content files. TinaCMS provides a web-based admin UI at `/admin` that edits those Markdown files and commits changes to GitHub. Cloudflare Pages auto-rebuilds on each push. Existing CSS stays untouched.

**Tech Stack:** Astro 5, TinaCMS 2.x, Tina Cloud (hosted), Markdown content, Cloudflare Pages

---

### Task 1: Astro Project Init

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

**Step 1: Initialize Astro in the existing repo**

```bash
cd /home/moe/runayoga
npm create astro@latest -- --template minimal --no-install --no-git .
```

If it refuses to init in non-empty dir, init in a temp dir and move files:

```bash
cd /tmp && mkdir astro-init && cd astro-init
npm create astro@latest -- --template minimal --no-install --no-git .
cp package.json astro.config.mjs tsconfig.json /home/moe/runayoga/
cd /home/moe/runayoga && rm -rf /tmp/astro-init
```

**Step 2: Configure astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://runayoga.pages.dev',
  outDir: './dist',
  build: {
    format: 'file'  // generates /yoga.html not /yoga/index.html
  }
});
```

**Step 3: Install dependencies**

```bash
cd /home/moe/runayoga && npm install
```

**Step 4: Create .gitignore additions**

Add to existing `.gitignore` (or create):
```
node_modules/
dist/
.astro/
```

**Step 5: Test Astro builds**

```bash
npx astro build
```

Expected: Empty build succeeds (no pages yet).

**Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "feat: init Astro project scaffold"
```

---

### Task 2: Install TinaCMS

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json` (scripts)

**Step 1: Install Tina CLI**

```bash
cd /home/moe/runayoga && npx @tinacms/cli@latest init
```

When prompted:
- Public assets directory: `public`
- Framework: `Other`
- Cloud ID: press Enter to skip

This creates `tina/config.ts` and sample content.

**Step 2: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "build": "tinacms build && astro build",
    "preview": "astro preview"
  }
}
```

**Step 3: Remove sample content**

Delete `content/posts/hello-world.md` if created by Tina init.

**Step 4: Test Tina + Astro dev**

```bash
npm run dev
```

Expected: Astro dev server starts, `/admin/index.html` loads Tina UI.

**Step 5: Commit**

```bash
git add tina/ package.json package-lock.json
git commit -m "feat: install TinaCMS with Astro integration"
```

---

### Task 3: BaseLayout + Header/Footer Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Move: `css/styles.css` → `public/css/styles.css`
- Move: `images/*` → `public/images/*`
- Move: `_headers` → `public/_headers`
- Move: `robots.txt` → `public/robots.txt`
- Move: `favicon.svg` → stays in `public/images/favicon.svg`

**Step 1: Move static assets to `public/`**

```bash
cd /home/moe/runayoga
mkdir -p public/css public/images
cp css/styles.css public/css/styles.css
cp images/* public/images/
cp _headers public/_headers
cp robots.txt public/robots.txt
```

**Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  ogUrl?: string;
  ogImage?: string;
}

const { title, description = '', ogUrl = '', ogImage = '/images/hero.jpg' } = Astro.props;
const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://runayoga.pages.dev${ogImage}`;
const fullOgUrl = ogUrl || `https://runayoga.pages.dev${Astro.url.pathname}`;
---

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <meta property="og:title" content={title} />
    {description && <meta property="og:description" content={description} />}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={fullOgUrl} />
    <meta property="og:image" content={fullOgImage} />
    <meta property="og:locale" content="de_DE" />
    <link rel="canonical" href={fullOgUrl} />
    <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <slot name="head" />
</head>
<body>
    <Header />
    <slot />
    <Footer />
    <script>
    // Scroll nav shadow
    (function() {
      var nav = document.getElementById('main-nav');
      if (!nav) return;
      function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    // Hamburger
    (function() {
      var btn = document.getElementById('hamburger');
      var links = document.getElementById('nav-links');
      if (!btn || !links) return;
      btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          if (a.closest('.nav-dropdown') && a === a.closest('.nav-dropdown').querySelector(':scope > a')) return;
          btn.classList.remove('active');
          links.classList.remove('open');
        });
      });
    })();

    // Mobile dropdown
    (function() {
      var dropdown = document.getElementById('nav-dropdown-angebot');
      if (!dropdown) return;
      var toggle = dropdown.querySelector(':scope > a');
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 968) {
          e.preventDefault();
          dropdown.classList.toggle('dropdown-open');
        }
      });
    })();

    // Active nav link
    (function() {
      var path = window.location.pathname;
      document.querySelectorAll('.nav-links a:not(.btn)').forEach(function(link) {
        var href = link.getAttribute('href');
        if (!href) return;
        if (path === href || (href !== '/' && path.startsWith(href.replace('.html', '')))) {
          link.classList.add('active');
          var parent = link.closest('.nav-dropdown');
          if (parent) {
            var parentLink = parent.querySelector(':scope > a');
            if (parentLink) parentLink.classList.add('active');
          }
        }
      });
    })();

    // Fade-in observer
    (function() {
      var els = document.querySelectorAll('.fade-in');
      if (!els.length) return;
      if (!('IntersectionObserver' in window)) {
        els.forEach(function(el) { el.classList.add('visible'); });
        return;
      }
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      els.forEach(function(el) { obs.observe(el); });
    })();
    </script>
</body>
</html>
```

**Step 3: Create `src/components/Header.astro`**

Migrate the nav from `js/components.js` `renderHeader()` to static Astro HTML:

```astro
<nav class="nav" id="main-nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <img src="/images/logo.png" alt="Runayoga" style="height:45px">
    </a>
    <ul class="nav-links" id="nav-links">
      <li class="nav-dropdown" id="nav-dropdown-angebot">
        <a href="/angebote">Angebot <span class="dropdown-arrow">&#9662;</span></a>
        <ul class="dropdown-menu">
          <li><a href="/yoga">Yoga</a></li>
          <li><a href="/pilates">Pilates</a></li>
          <li><a href="/massagen">Massagen</a></li>
          <li><a href="/heilraum">Heilraum</a></li>
          <li><a href="/mantra">Mantra</a></li>
          <li><a href="/jahreskreis">Jahreskreis</a></li>
        </ul>
      </li>
      <li><a href="/ueber-mich">Über mich</a></li>
      <li><a href="/retreat">Retreat</a></li>
      <li><a href="/preise">Preise</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/kontakt" class="btn btn-primary">Kontakt</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Menü öffnen">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

**Step 4: Create `src/components/Footer.astro`**

Migrate footer from `js/components.js` `renderFooter()` to static Astro HTML. Same markup, but with Astro components. Use the site collection data later; hardcode for now.

```astro
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/">
          <img src="/images/logo.png" alt="Runayoga" style="height:40px">
        </a>
        <p>Yoga, Pilates &amp; Massage in Berlin-Pankow. Finde deine Balance — auf und neben der Matte.</p>
        <div class="footer-contact-info">
          <p>runabulla@gmail.com</p>
          <p>+49 163 139 1059</p>
          <p>Berlin-Pankow</p>
        </div>
      </div>
      <div>
        <h4 class="footer-heading">Quicklinks</h4>
        <ul class="footer-links">
          <li><a href="/angebote">Angebot</a></li>
          <li><a href="/ueber-mich">Über mich</a></li>
          <li><a href="/retreat">Retreat</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-heading">Rechtliches</h4>
        <ul class="footer-links">
          <li><a href="/impressum">Impressum</a></li>
          <li><a href="/datenschutz">Datenschutz</a></li>
        </ul>
        <div class="footer-social">
          <a href="https://www.instagram.com/runayoga_berlin/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="mailto:runabulla@gmail.com" aria-label="E-Mail">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Runayoga. Alle Rechte vorbehalten.</p>
    </div>
  </div>
</footer>
```

**Step 5: Add Header/Footer imports to BaseLayout.astro head**

Add at top of `BaseLayout.astro`:
```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
// ... rest of frontmatter
---
```

**Step 6: Verify layout renders**

Create minimal `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Runayoga – Test">
  <h1>Test</h1>
</BaseLayout>
```

```bash
npm run build
```

Expected: `dist/index.html` exists with full nav, footer, CSS loaded.

**Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: BaseLayout, Header, Footer Astro components + static assets"
```

---

### Task 4: Tina Schema — All Collections

**Files:**
- Modify: `tina/config.ts`

**Step 1: Write the complete Tina config**

Replace `tina/config.ts` with all 6 collections:

```typescript
import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      // --- Site-wide settings ---
      {
        name: 'site',
        label: 'Seitenweite Daten',
        path: 'src/content',
        format: 'md',
        match: { include: 'site' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'name', label: 'Studio-Name', required: true },
          { type: 'string', name: 'email', label: 'E-Mail', required: true },
          { type: 'string', name: 'phone', label: 'Telefon' },
          { type: 'string', name: 'address', label: 'Adresse' },
          { type: 'string', name: 'instagram', label: 'Instagram URL' },
          { type: 'string', name: 'whatsapp', label: 'WhatsApp Nummer' },
          {
            type: 'object', name: 'opening_hours', label: 'Öffnungszeiten', list: true,
            fields: [
              { type: 'string', name: 'day', label: 'Tag' },
              { type: 'string', name: 'hours', label: 'Zeiten' },
            ],
          },
        ],
      },
      // --- Home page ---
      {
        name: 'home',
        label: 'Startseite',
        path: 'src/content',
        format: 'md',
        match: { include: 'home' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'hero_title', label: 'Hero Titel', required: true },
          { type: 'string', name: 'hero_subtitle', label: 'Hero Untertitel' },
          { type: 'string', name: 'hero_cta_text', label: 'Hero Button Text' },
          { type: 'string', name: 'hero_cta_link', label: 'Hero Button Link' },
          { type: 'image', name: 'hero_image', label: 'Hero Bild' },
          { type: 'string', name: 'philosophy_quote', label: 'Philosophie Zitat' },
          { type: 'string', name: 'philosophy_cite', label: 'Zitat Quelle' },
          { type: 'string', name: 'about_label', label: 'Über mich Label' },
          { type: 'string', name: 'about_title', label: 'Über mich Titel' },
          { type: 'rich-text', name: 'about_text', label: 'Über mich Text' },
          { type: 'string', name: 'retreat_label', label: 'Retreat Label' },
          { type: 'string', name: 'retreat_title', label: 'Retreat Titel' },
          { type: 'rich-text', name: 'retreat_text', label: 'Retreat Text' },
          {
            type: 'object', name: 'testimonials', label: 'Testimonials', list: true,
            fields: [
              { type: 'string', name: 'quote', label: 'Zitat', required: true },
              { type: 'string', name: 'author', label: 'Autor', required: true },
              { type: 'number', name: 'stars', label: 'Sterne (1-5)' },
            ],
          },
        ],
      },
      // --- Pages (Über mich, Retreat, Kontakt, Impressum, Datenschutz) ---
      {
        name: 'page',
        label: 'Seiten',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Titel', required: true, isTitle: true },
          { type: 'string', name: 'subtitle', label: 'Untertitel' },
          { type: 'string', name: 'seo_description', label: 'SEO Beschreibung' },
          { type: 'rich-text', name: 'body', label: 'Inhalt', isBody: true },
        ],
      },
      // --- Angebote (6 detail pages) ---
      {
        name: 'angebot',
        label: 'Angebote',
        path: 'src/content/angebote',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Titel', required: true, isTitle: true },
          { type: 'string', name: 'subtitle', label: 'Untertitel' },
          { type: 'string', name: 'seo_description', label: 'SEO Beschreibung' },
          { type: 'rich-text', name: 'body', label: 'Beschreibung', isBody: true },
          {
            type: 'string', name: 'highlights', label: 'Was dich erwartet', list: true,
          },
          { type: 'string', name: 'target_audience', label: 'Für wen geeignet' },
          { type: 'number', name: 'sort_order', label: 'Reihenfolge (1-6)' },
        ],
      },
      // --- Blog ---
      {
        name: 'blog',
        label: 'Blog',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Titel', required: true, isTitle: true },
          { type: 'datetime', name: 'date', label: 'Datum', required: true },
          { type: 'string', name: 'author', label: 'Autor' },
          { type: 'string', name: 'excerpt', label: 'Kurzbeschreibung' },
          { type: 'string', name: 'seo_description', label: 'SEO Beschreibung' },
          { type: 'image', name: 'image', label: 'Beitragsbild' },
          { type: 'rich-text', name: 'body', label: 'Inhalt', isBody: true },
        ],
      },
      // --- Preise ---
      {
        name: 'preise',
        label: 'Preise',
        path: 'src/content',
        format: 'md',
        match: { include: 'preise' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'title', label: 'Seitentitel', required: true },
          { type: 'string', name: 'subtitle', label: 'Untertitel' },
          { type: 'string', name: 'seo_description', label: 'SEO Beschreibung' },
          {
            type: 'object', name: 'sections', label: 'Preisgruppen', list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label (klein)' },
              { type: 'string', name: 'title', label: 'Gruppenname' },
              { type: 'string', name: 'description', label: 'Beschreibung' },
              {
                type: 'object', name: 'cards', label: 'Preiskarten', list: true,
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'price', label: 'Preis' },
                  { type: 'string', name: 'period', label: 'Zeitraum' },
                  { type: 'string', name: 'features', label: 'Features', list: true },
                  { type: 'boolean', name: 'featured', label: 'Hervorgehoben' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
```

**Step 2: Test schema compiles**

```bash
npm run dev
```

Expected: No schema errors, `/admin` loads with empty collections.

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: Tina CMS schema — 6 collections (site, home, pages, angebote, blog, preise)"
```

---

### Task 5: Content Extraction — Markdown Files

**Files:**
- Create: `src/content/site.md`
- Create: `src/content/home.md`
- Create: `src/content/preise.md`
- Create: `src/content/pages/ueber-mich.md`
- Create: `src/content/pages/retreat.md`
- Create: `src/content/pages/kontakt.md`
- Create: `src/content/pages/impressum.md`
- Create: `src/content/pages/datenschutz.md`
- Create: `src/content/pages/angebote.md`
- Create: `src/content/angebote/yoga.md`
- Create: `src/content/angebote/pilates.md`
- Create: `src/content/angebote/massagen.md`
- Create: `src/content/angebote/heilraum.md`
- Create: `src/content/angebote/mantra.md`
- Create: `src/content/angebote/jahreskreis.md`
- Create: `src/content/blog/yoga-im-alltag.md`
- Create: `src/content/blog/atemtechnik-pranayama.md`
- Create: `src/content/blog/retreat-erfahrung.md`

**Step 1: Extract content from each existing HTML file into Markdown with YAML frontmatter**

Each Markdown file has YAML frontmatter matching the Tina schema fields, and the body content is the rich-text from the HTML `<p>`, `<h2>`, `<ul>` elements.

Example — `src/content/angebote/yoga.md`:
```markdown
---
title: Yoga
subtitle: Finde Gleichgewicht und innere Ruhe
seo_description: "Hatha Yoga, Vinyasa Flow und Yin Yoga in kleinen Gruppen in Berlin-Pankow. Zertifizierte Präventionskurse bei Runayoga."
highlights:
  - Kleine Gruppen für individuelle Betreuung
  - Alle Level willkommen — vom Anfänger bis Fortgeschrittene
  - Krankenkassenzertifizierte Präventionskurse (§20 SGB V)
  - Einzelstunden für deine persönliche Praxis möglich
  - Online-Yoga als flexible Ergänzung
  - Hatha, Vinyasa und Yin Yoga im Angebot
target_audience: "Yoga ist für alle da. Ob du nach Ausgleich zum stressigen Alltag suchst, Rückenschmerzen lindern möchtest oder einfach etwas Gutes für dich tun willst — du bist herzlich willkommen."
sort_order: 1
---

Yoga ist für mich weit mehr als Körperübungen auf der Matte...
(full body text from yoga.html)
```

Example — `src/content/blog/yoga-im-alltag.md`:
```markdown
---
title: "5 Wege, Yoga in deinen Alltag zu integrieren"
date: 2026-02-15
author: Runa
excerpt: "Praktische Tipps von Runayoga für mehr Achtsamkeit und Balance jeden Tag."
seo_description: "5 einfache Wege, Yoga in deinen Alltag zu integrieren. Praktische Tipps von Runayoga."
---

Hand aufs Herz: Wie oft hast du dir schon vorgenommen...
(full body text from blog/yoga-im-alltag.html)
```

Extract all text content from the 18 existing HTML files into their respective Markdown files.

**Step 2: Verify content files are valid**

```bash
npm run dev
```

Expected: `/admin` shows all collections with populated content.

**Step 3: Commit**

```bash
git add src/content/
git commit -m "feat: extract all page content to Markdown (18 files, 6 collections)"
```

---

### Task 6: Astro Pages — Home + Angebote

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/angebote.astro`
- Create: `src/pages/[slug].astro` (dynamic: yoga, pilates, etc.)
- Create: `src/components/ServiceCard.astro`

**Step 1: Create ServiceCard component**

`src/components/ServiceCard.astro`:
```astro
---
interface Props {
  href: string;
  title: string;
  description: string;
  icon: string;  // raw SVG string
}
const { href, title, description, icon } = Astro.props;
---

<a href={href} class="service-card fade-in">
  <div class="service-icon">
    <Fragment set:html={icon} />
  </div>
  <h3>{title}</h3>
  <p>{description}</p>
  <span class="card-arrow">Mehr erfahren &rarr;</span>
</a>
```

**Step 2: Create home page**

`src/pages/index.astro` — reads `src/content/home.md` via Tina client, renders all 7 sections (hero, services, philosophy, about, retreat, testimonials, CTA) using the same HTML structure as the current `index.html`. Import data with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ServiceCard from '../components/ServiceCard.astro';
import { client } from '../../tina/__generated__/client';

const homeRes = await client.queries.home({ relativePath: 'home.md' });
const home = homeRes.data.home;

const angeboteRes = await client.queries.angebotConnection();
const angebote = angeboteRes.data.angebotConnection.edges
  ?.map(e => e?.node)
  .filter(Boolean)
  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [];
---

<BaseLayout title="Runayoga – Yoga, Pilates & Massagen in Berlin-Pankow" description={...}>
  <!-- Hero section using home.hero_title, home.hero_subtitle etc. -->
  <!-- Services grid iterating angebote -->
  <!-- Philosophy using home.philosophy_quote -->
  <!-- About teaser using home.about_title, home.about_text -->
  <!-- Retreat teaser using home.retreat_title, home.retreat_text -->
  <!-- Testimonials iterating home.testimonials -->
  <!-- CTA section -->
</BaseLayout>
```

**Step 3: Create angebote overview page**

`src/pages/angebote.astro` — lists all 6 services as cards.

**Step 4: Create dynamic angebot detail page**

`src/pages/[slug].astro` for yoga, pilates, massagen, heilraum, mantra, jahreskreis:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { client } from '../../tina/__generated__/client';

export async function getStaticPaths() {
  const res = await client.queries.angebotConnection();
  const paths = res.data.angebotConnection.edges?.map(e => ({
    params: { slug: e?.node?._sys.filename },
  })) || [];
  return paths;
}

const { slug } = Astro.params;
const res = await client.queries.angebot({ relativePath: `${slug}.md` });
const angebot = res.data.angebot;
---

<BaseLayout title={`${angebot.title} – Runayoga`} description={angebot.seo_description}>
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb">
        <a href="/">Home</a> <span>/</span> <a href="/angebote">Angebot</a> <span>/</span> <span>{angebot.title}</span>
      </nav>
      <h1>{angebot.title}</h1>
      <p>{angebot.subtitle}</p>
    </div>
  </section>
  <section>
    <div class="detail-content fade-in">
      <!-- Render angebot.body (rich-text) -->
      <!-- Render highlights list -->
      <!-- Render target_audience if present -->
      <!-- Pricing teaser + CTA buttons -->
    </div>
  </section>
</BaseLayout>
```

**Step 5: Verify build**

```bash
npm run build
```

Expected: `dist/index.html`, `dist/angebote.html`, `dist/yoga.html`, `dist/pilates.html`, etc. exist.

**Step 6: Commit**

```bash
git add src/pages/ src/components/ServiceCard.astro
git commit -m "feat: home, angebote overview, 6 detail pages (Astro + Tina)"
```

---

### Task 7: Astro Pages — Remaining Pages

**Files:**
- Create: `src/pages/ueber-mich.astro`
- Create: `src/pages/retreat.astro`
- Create: `src/pages/preise.astro`
- Create: `src/pages/kontakt.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/impressum.astro`
- Create: `src/pages/datenschutz.astro`
- Create: `src/components/PricingCard.astro`
- Create: `src/components/TestimonialCard.astro`

**Step 1: Create PricingCard component**

**Step 2: Create each page**

Each page follows the same pattern:
1. Import BaseLayout
2. Fetch content from Tina client
3. Render with existing CSS classes
4. Same HTML structure as the original static pages

For blog pages:
- `src/pages/blog/index.astro` — lists all blog posts sorted by date
- `src/pages/blog/[slug].astro` — renders individual blog post with `getStaticPaths()`

For preise:
- Read `preise.md` with sections[].cards[] and render the pricing grid dynamically

**Step 3: Verify full build**

```bash
npm run build && ls -la dist/
```

Expected: All 18 HTML files exist in `dist/`.

**Step 4: Visual comparison**

Open `dist/index.html` in browser, compare with current live site. CSS should be identical.

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: all remaining pages — blog, preise, kontakt, ueber-mich, retreat, legal"
```

---

### Task 8: Sitemap + JSON-LD + SEO

**Files:**
- Create: `src/pages/sitemap.xml.ts` (dynamic sitemap from Tina data)
- Modify: `src/layouts/BaseLayout.astro` (JSON-LD slot)

**Step 1: Dynamic sitemap**

```typescript
// src/pages/sitemap.xml.ts
import { client } from '../../tina/__generated__/client';

export async function GET() {
  const base = 'https://runayoga.pages.dev';
  const blogRes = await client.queries.blogConnection();
  const blogs = blogRes.data.blogConnection.edges?.map(e => e?.node) || [];

  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/angebote', priority: '0.8' },
    { url: '/ueber-mich', priority: '0.8' },
    { url: '/retreat', priority: '0.8' },
    { url: '/preise', priority: '0.8' },
    { url: '/blog', priority: '0.8' },
    { url: '/kontakt', priority: '0.8' },
    { url: '/yoga', priority: '0.6' },
    { url: '/pilates', priority: '0.6' },
    { url: '/massagen', priority: '0.6' },
    { url: '/heilraum', priority: '0.6' },
    { url: '/mantra', priority: '0.6' },
    { url: '/jahreskreis', priority: '0.6' },
    { url: '/impressum', priority: '0.3' },
    { url: '/datenschutz', priority: '0.3' },
  ];

  const blogEntries = blogs.map(b => ({
    url: `/blog/${b._sys.filename}`,
    priority: '0.5',
  }));

  const entries = [...staticPages, ...blogEntries];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${base}${e.url}</loc><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```

**Step 2: Add JSON-LD to index.astro head slot**

Same structured data as current `index.html`, but reading from site collection.

**Step 3: Verify**

```bash
npm run build && cat dist/sitemap.xml
```

**Step 4: Commit**

```bash
git add src/
git commit -m "feat: dynamic sitemap + JSON-LD structured data"
```

---

### Task 9: Clean Up Old Files + Final Build

**Files:**
- Remove: `index.html`, `angebote.html`, `yoga.html`, `pilates.html`, `massagen.html`, `heilraum.html`, `mantra.html`, `jahreskreis.html`, `ueber-mich.html`, `retreat.html`, `preise.html`, `blog.html`, `blog/`, `kontakt.html`, `impressum.html`, `datenschutz.html`
- Remove: `js/components.js`, `css/styles.css` (now in `public/`)
- Remove: `_headers`, `robots.txt`, `sitemap.xml` (now in `public/` or generated)
- Remove: `images/` folder at root (now in `public/images/`)

**Step 1: Remove old static files**

```bash
git rm index.html angebote.html yoga.html pilates.html massagen.html heilraum.html mantra.html jahreskreis.html ueber-mich.html retreat.html preise.html blog.html kontakt.html impressum.html datenschutz.html
git rm -r blog/ js/ css/ images/
git rm _headers robots.txt sitemap.xml
```

**Step 2: Final full build + verify**

```bash
npm run build
ls -la dist/
```

Expected: All 18+ HTML files, `sitemap.xml`, `css/`, `images/` in dist.

**Step 3: Local preview**

```bash
npm run preview
```

Open browser, verify all pages render correctly.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old static HTML files, migration to Astro complete"
```

---

### Task 10: Deploy to Cloudflare Pages

**Files:**
- Modify Cloudflare Pages project settings (via API)

**Step 1: Update CF Pages build settings**

```bash
CF_TOKEN=$(cat /home/moe/.cloudflare-token | tr -d '\n')
CF_ACCOUNT="9f08f4ee211f4edb8da5c87e81dbf2ef"

curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/runayoga" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "build_config": {
      "build_command": "npx tinacms build && npx astro build",
      "destination_dir": "dist",
      "root_dir": ""
    },
    "deployment_configs": {
      "production": {
        "env_vars": {
          "NODE_VERSION": { "value": "20" }
        }
      }
    }
  }'
```

**Step 2: Push to GitHub**

```bash
git push origin main
```

**Step 3: Monitor deployment**

```bash
sleep 60
curl -s "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/runayoga/deployments" \
  -H "Authorization: Bearer $CF_TOKEN" | python3 -c "..."
```

Expected: Deployment status "success".

**Step 4: Verify live site**

```bash
curl -s -o /dev/null -w "%{http_code}" https://runayoga.pages.dev/
```

Expected: 200

**Step 5: Commit any config fixes**

---

### Task 11: Tina Cloud Setup

**Step 1: Register project on Tina Cloud**

Go to https://app.tina.io/ → Create Project → Connect to GitHub `Zeo-ID/runayoga`.

**Step 2: Get Client ID and Token**

Copy the Client ID and read-only token from Tina Cloud dashboard.

**Step 3: Set environment variables in Cloudflare Pages**

```bash
CF_TOKEN=$(cat /home/moe/.cloudflare-token | tr -d '\n')
CF_ACCOUNT="9f08f4ee211f4edb8da5c87e81dbf2ef"

curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/runayoga" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_configs": {
      "production": {
        "env_vars": {
          "TINA_CLIENT_ID": { "value": "<CLIENT_ID>" },
          "TINA_TOKEN": { "value": "<READ_TOKEN>" },
          "NODE_VERSION": { "value": "20" }
        }
      }
    }
  }'
```

**Step 4: Trigger rebuild**

```bash
git commit --allow-empty -m "chore: trigger rebuild with Tina Cloud env vars" && git push origin main
```

**Step 5: Verify `/admin` works**

Open `https://runayoga.pages.dev/admin/` — should show Tina CMS login, then editor UI.

**Step 6: Test editing**

Edit a blog post title in the admin, save. Verify a new commit appears in GitHub, and Cloudflare auto-rebuilds.

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Astro project init | package.json, astro.config.mjs |
| 2 | Install TinaCMS | tina/config.ts, package.json |
| 3 | BaseLayout + Header/Footer | 3 Astro components, move static assets |
| 4 | Tina schema (6 collections) | tina/config.ts |
| 5 | Content extraction (18 Markdown files) | src/content/**/*.md |
| 6 | Home + Angebote pages | 3 Astro pages + ServiceCard |
| 7 | Remaining pages (blog, preise, etc.) | 8 Astro pages + 2 components |
| 8 | Dynamic sitemap + JSON-LD | sitemap.xml.ts, BaseLayout |
| 9 | Clean up old files | Remove 18 HTML + js/ + css/ |
| 10 | Deploy to Cloudflare Pages | CF API config |
| 11 | Tina Cloud setup | Env vars, verify /admin |
