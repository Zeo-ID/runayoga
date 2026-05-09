# Admin-Portal Ausbaukonzept — Webseiten-CMS für Kunden

## Kontext & Ist-Zustand

### Geschäftsmodell
Wir erstellen Webseiten für Kunden. Workflow: bestehende Seite scannen → neue Seite bauen → über GitHub deployen → über Cloudflare Pages ausliefern. Jeder Kunde bekommt eigenen GitHub-Account und Cloudflare-Account. Verwaltung im Hintergrund über Claude Code auf Ubuntu-Server (Proxmox). Kunden bearbeiten ihre Seite selbst über `/admin/` (geschützt via Cloudflare Access MFA).

### Aktueller Admin-Bereich (Referenz: runayoga.pages.dev/admin/)

**Architektur:**
- Rein statische Seite (HTML + Vanilla JS, kein Framework)
- Content als Markdown-Dateien im GitHub-Repo (`src/content/*.md`)
- Admin-Portal als separate HTML-Seite im selben Repo
- Kommunikation mit GitHub API direkt aus dem Browser
- Publish = GitHub Commit → Cloudflare Pages Build (1-2 Min)

**Vorhandene Features:**
- Sidebar-Navigation: Allgemein (Startseite, Preise & Pakete, Seitenweite Daten), Angebote, Blog, Seiten
- Zwei Ansichten: "Vorschau" (inline-editierbarer Content) und "Formular" (klassische Eingabefelder)
- Versionierung (letzte 20 Versionen mit 1-Klick-Wiederherstellung)
- Speichern / Veröffentlichen / Verwerfen / Löschen
- Bild-Upload via "Hochladen"-Button
- "+ Neuer Eintrag" für Blog, Angebote, Seiten
- Theme-Auswahl (Sage, Ocean, Sunset, Lavender, Earth) mit Farb-Picker
- Seitenweite Daten (Kontakt, Öffnungszeiten, Social Links) mit Array-Support

**Einschränkungen:**
- Textbearbeitung ist plain-text (keine Formatierung wie Fett, Kursiv, Listen)
- Kein visueller Drag & Drop Page Builder
- Keine Mediathek
- Keine SEO-Tools
- Keine KI-gestützte Textverbesserung
- Kein Seitenaufbau-Editor (Sections hinzufügen/entfernen/umsortieren)

---

## Architektur-Entscheidung: Migration zu Next.js + Puck

### Neue Architektur

```
┌──────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                       │
│                  (Hosting + CDN + MFA)                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Öffentliche Seiten          Admin-Bereich              │
│   /                           /admin/[[...puckPath]]     │
│   /angebote/yoga              (geschützt via CF Access)  │
│   /blog/post-1                                           │
│   /kontakt                    ┌─────────────────────┐    │
│                               │   Puck Editor       │    │
│   ← SSG (Static Generation)  │   Drag & Drop       │    │
│     bei Build                 │   Live Preview      │    │
│                               │   Custom Components │    │
│                               └────────┬────────────┘    │
│                                        │                 │
│                               ┌────────▼────────────┐    │
│                               │  onPublish Callback  │    │
│                               │  → JSON speichern    │    │
│                               └────────┬────────────┘    │
│                                        │                 │
├────────────────────────────────────────┼─────────────────┤
│                               ┌────────▼────────────┐    │
│   API Route (Next.js)         │ /api/github-commit   │    │
│   oder Cloudflare Worker      │ Octokit → GitHub API │    │
│                               └────────┬────────────┘    │
│                                        │                 │
├────────────────────────────────────────┼─────────────────┤
│                               ┌────────▼────────────┐    │
│   GitHub Repository           │  content/home.json   │    │
│   (pro Kunde)                 │  content/blog/*.json │    │
│                               │  images/*            │    │
│                               └────────┬────────────┘    │
│                                        │                 │
│                               Auto-Deploy bei Commit     │
│                               (Cloudflare Pages Build)   │
└──────────────────────────────────────────────────────────┘
```

### Content-Format: JSON statt Markdown

Puck speichert Seiteninhalt als strukturiertes JSON.

---

## Komponenten-Katalog

| Komponente | Beschreibung | Editierbare Props |
|------------|-------------|-------------------|
| `Hero` | Hero-Bereich mit Bild + Text + Buttons | Titel, Untertitel, Button-Text, Button-Link, Bild, Layout |
| `RichText` | Freitext-Block mit TipTap-Editor | HTML-Content (WYSIWYG) |
| `TextImage` | Text + Bild nebeneinander | Überschrift, Body, Bild, Bild-Position |
| `Cards` | Karten-Grid (2/3/4 Spalten) | Überschrift, Karten-Array, Spalten |
| `Testimonials` | Kundenstimmen-Karussell | Überschrift, Array: [{Text, Name, Bewertung}] |
| `CTA` | Call-to-Action Banner | Überschrift, Text, Button-Text, Button-Link |
| `Gallery` | Bildergalerie mit Lightbox | Überschrift, Bilder-Array, Spalten |
| `Pricing` | Preistabelle | Überschrift, Pakete-Array |
| `FAQ` | FAQ-Akkordeon | Überschrift, Fragen-Array |
| `Contact` | Kontakt-Bereich | Überschrift, Text, Map-Embed |
| `Quote` | Zitat-Block | Zitat-Text, Quelle, Stil |
| `BlogList` | Blog-Übersicht (automatisch) | Überschrift, Anzahl, Sortierung |
| `Divider` | Trennlinie/Abstand | Stil, Höhe |
| `Video` | Video-Embed | YouTube/Vimeo URL, Poster-Bild |
| `Map` | Google Maps Embed | Adresse, Zoom, Höhe |

---

## Implementierungs-Reihenfolge

### Phase 1 — Next.js + Puck Grundgerüst
1. Next.js Projekt aufsetzen mit Tailwind CSS v4
2. Puck installieren
3. Admin-Route erstellen (`/admin/[[...puckPath]]`)
4. 3-4 Basis-Komponenten (Hero, RichText, Cards, CTA)
5. GitHub API Integration (Octokit)
6. Cloudflare Pages Deployment
7. Testen: Bearbeiten → Speichern → Commit → Build → Live

### Phase 2 — Vollständige Komponenten-Bibliothek
1. Alle 15 Komponenten
2. TipTap als Custom Field
3. Responsive Styles
4. Theme-System

### Phase 3 — Mediathek
1. ImagePicker Custom Field
2. Mediathek-Modal
3. Client-seitige Bildoptimierung

### Phase 4 — SEO-Tools
1. Root Fields für Meta-Tags
2. SEO-Score Analyse
3. JSON-LD Structured Data

### Phase 5 — KI-Textverbesserung
1. Cloudflare Worker
2. KI-Buttons in TipTap
3. Diff-Ansicht

### Phase 6 — Migration + Template
1. Markdown → Puck JSON Script
2. RunaYoga migrieren
3. Template für neue Kunden

---

## Technologie-Stack
- **Framework:** Next.js 14+ (App Router, SSG)
- **Page Builder:** Puck (@measured/puck)
- **Rich Text:** TipTap
- **Styling:** Tailwind CSS v4
- **GitHub API:** Octokit
- **Hosting:** Cloudflare Pages
- **Auth:** Cloudflare Access (MFA)
- **KI:** Anthropic Claude Haiku (via Cloudflare Worker)
