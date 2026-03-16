# ZAIOS Astro Template

Astro 6 Website-Template mit integriertem Admin-Panel, MFA-Authentifizierung und Cloudflare Pages Deployment.

## Features

- **Astro 6 SSG** — Statische Seiten, blitzschnell
- **Admin-Panel** (`/admin`) — Visueller Content-Editor mit Vorschau
  - Inline-Editing (Texte, Bilder, Listen)
  - Formular-Modus fuer alle Felder
  - Versionsverlauf mit Rollback (via GitHub Commits API)
  - Verwerfen-Funktion fuer ungespeicherte Aenderungen
  - Deploy-Status-Anzeige (Live-Feedback beim Veroeffentlichen)
  - Benutzerhandbuch integriert
- **MFA-Login** — TOTP-basierte Zwei-Faktor-Authentifizierung mit Recovery-Codes
- **Theme-System** — 5 Farbpresets + Custom-Colors ueber Admin-Panel
- **Content via Markdown** — YAML-Frontmatter + Markdown-Body
- **SEO** — Sitemap, JSON-LD, Open Graph, Meta-Tags
- **Responsive** — Mobile-first mit Hamburger-Menu und Dropdowns
- **Security Headers** — CSP, X-Frame-Options, Referrer-Policy
- **Cloudflare Pages** — Zero-Config Deployment mit Workers-Functions

## Schnellstart

```bash
# 1. Template klonen
git clone https://github.com/Zeo-ID/zaios-astro-template.git mein-projekt
cd mein-projekt

# 2. Dependencies installieren
npm install

# 3. Platzhalter ersetzen (siehe Konfiguration)

# 4. Entwicklungsserver starten
npm run dev

# 5. Build
npm run build
```

## Konfiguration

### 1. Platzhalter ersetzen

Suche nach `{{PLACEHOLDER}}` in allen Dateien und ersetze mit deinen Daten:

| Platzhalter | Beschreibung | Dateien |
|---|---|---|
| `{{SITE_NAME}}` | Name der Website/Firma | site.md, home.md, Impressum, Datenschutz |
| `{{OWNER_NAME}}` | Inhaber-Name | Impressum, Datenschutz |
| `{{COMPANY_NAME}}` | Firmenname (falls abweichend) | Impressum, Footer |
| `{{EMAIL}}` | Kontakt-E-Mail | site.md, Impressum, Kontakt |
| `{{PHONE}}` | Telefonnummer | site.md, Impressum, Kontakt |
| `{{ADDRESS}}` | Adresse | Impressum |
| `{{CITY}}` | Stadt | site.md, home.md |
| `{{INSTAGRAM_HANDLE}}` | Instagram-Handle | site.md |
| `{{WHATSAPP_NUMBER}}` | WhatsApp-Nummer | site.md |

### 2. Cloudflare Pages einrichten

1. Neues Cloudflare Pages Projekt erstellen
2. GitHub-Repo verbinden
3. Build-Einstellungen:
   - Framework: `Astro`
   - Build command: `npm run build`
   - Output: `dist`
4. Environment Variables setzen:

| Variable | Beschreibung |
|---|---|
| `ADMIN_PASSWORD` | Passwort fuer Admin-Login |
| `GITHUB_TOKEN` | GitHub Personal Access Token (repo scope) |
| `DEPLOY_HOOK_URL` | CF Pages Deploy Hook URL |
| `CF_ACCOUNT_ID` | Cloudflare Account ID (fuer Deploy-Status) |
| `CF_DEPLOY_TOKEN` | CF API Token (fuer Deploy-Status) |
| `CF_PROJECT_NAME` | CF Pages Projektname (fuer Deploy-Status) |

### 3. Optional: MFA aktivieren

MFA benoetigt einen KV Namespace:

1. In CF Dashboard: Workers & Pages > KV > Namespace erstellen
2. Name: `AUTH_KV` (oder beliebig)
3. In Pages-Projekt: Settings > Functions > KV Namespace Bindings
4. Variable: `AUTH_KV` → erstellten Namespace waehlen

Ohne KV funktioniert der Login nur mit Passwort (kein MFA).

## Projektstruktur

```
src/
  content/          # Markdown-Inhalte (YAML + Body)
    home.md         # Startseite
    site.md         # Globale Konfiguration (Name, Farben, Kontakt)
    preise.md       # Preisseite
    angebote/       # Einzelne Angebotsseiten
    blog/           # Blog-Beitraege
    pages/          # Statische Seiten (Impressum, Datenschutz, etc.)
  pages/            # Astro-Routen (automatisches Routing)
  components/       # Wiederverwendbare Komponenten
  layouts/          # Seitenlayouts
  lib/              # Hilfsfunktionen (Content-Loader)
public/
  css/styles.css    # Hauptstylesheet
  images/           # Bilder (Logo, Hero, etc.)
  admin/            # Admin-Panel (HTML + JS)
functions/
  api/              # CF Workers (Auth, MFA, Deploy)
  lib/              # Shared Libraries (TOTP)
```

## Content bearbeiten

### Via Admin-Panel (empfohlen)

1. `/admin` aufrufen
2. Einloggen mit Admin-Passwort (+ MFA falls aktiviert)
3. Inhalte in der Seitenleiste auswaehlen
4. Texte direkt in der Vorschau bearbeiten oder Formular nutzen
5. Speichern → Veroeffentlichen

### Via Markdown-Dateien

Alle Inhalte liegen unter `src/content/` als Markdown mit YAML-Frontmatter:

```markdown
---
title: "Seitentitel"
subtitle: "Untertitel"
seo_title: "SEO Titel"
seo_description: "SEO Beschreibung"
---

## Ueberschrift

Hier kommt der Inhalt...
```

## Anpassen

### Neue Angebotsseite hinzufuegen

1. Neue `.md` in `src/content/angebote/` erstellen
2. `slug` und `sort_order` setzen
3. Icon in `src/pages/angebote.astro` hinzufuegen
4. Navigation in `src/components/Header.astro` erweitern

### Theme aendern

In `src/content/site.md` die Farben anpassen oder im Admin-Panel unter "Allgemein" > Theme.

### Neue Seite hinzufuegen

1. `.md` in `src/content/pages/` erstellen
2. `.astro` in `src/pages/` erstellen (kopiere impressum.astro als Vorlage)
3. Navigation in Header.astro ergaenzen

## Template-Updates (Upstream Sync)

Dieses Projekt erhaelt automatisch Updates vom ZAIOS Astro Template via GitHub Actions.

### Einrichtung (einmalig)

1. **TEMPLATE_TOKEN** als Repository Secret anlegen:
   - Settings > Secrets > Actions > New Repository Secret
   - Name: `TEMPLATE_TOKEN`
   - Value: GitHub PAT mit `repo` Scope (Zugriff auf `Zeo-ID/zaios-astro-template`)

2. Die Workflow-Datei `.github/workflows/sync-template.yml` ist bereits enthalten.

### Wie es funktioniert

- **Jeden Montag um 6:00 UTC** prueft der Workflow auf neue Template-Aenderungen
- Bei Updates wird automatisch ein **Pull Request** erstellt
- **Eure Inhalte bleiben erhalten:** Content (Texte, Bilder, CSS) wird NICHT ueberschrieben
- **Framework-Updates** (Components, Layouts, Functions, Admin) werden aktualisiert
- Konflikte werden automatisch aufgeloest (Kundeninhalt > Template)
- Der PR kann manuell geprueft und gemergt werden

### Manueller Sync

Im GitHub-Tab "Actions" > "Sync Template Updates" > "Run workflow" klicken.

### Was wird aktualisiert?

| Aktualisiert (Template) | Beibehalten (Kunde) |
|---|---|
| Astro Components/Layouts | src/content/ (alle Inhalte) |
| Admin-Panel | public/images/ |
| Cloudflare Functions | public/css/styles.css |
| Security Headers | site.md Konfiguration |
| Package Updates | Blog-Beitraege |

## Technologie

| Komponente | Technologie |
|---|---|
| Framework | Astro 6 |
| Styling | Vanilla CSS + Custom Properties |
| Fonts | Google Fonts (Cormorant Garamond + Inter) |
| Icons | Inline SVG |
| Auth | TOTP MFA (otpauth) |
| Content | Markdown + gray-matter + marked |
| Hosting | Cloudflare Pages |
| Functions | Cloudflare Workers |

## Lizenz

Proprietaer — ZAIOS UG. Nur fuer autorisierte Nutzung.
