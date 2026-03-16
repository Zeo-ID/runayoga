# Runayoga Admin v2 — TOTP MFA, Inline-Editing, Theme-System

**Datum:** 2026-03-16
**Status:** Approved
**Ziel:** Admin-Panel aufwerten: MFA-Absicherung, visuelle Bearbeitung, Designvorlagen + Farbanpassung. Seite dient als Template für weitere Projekte.

## 1. TOTP MFA-App Login

### Ablauf
- **Erster Login:** Passwort → TOTP-Setup (QR-Code scannen) → Secret in CF KV speichern → Recovery-Codes anzeigen
- **Normaler Login:** Passwort → TOTP-Code → GitHub-Token zurück
- **Library:** `otpauth` (ESM, CF Workers kompatibel, ~4KB)
- **Storage:** Cloudflare KV Namespace `RUNAYOGA_AUTH` (Key: `totp_secret`, `recovery_codes`)

### Neue Endpoints
| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/api/auth` | POST | Passwort prüfen → `{ mfa_required, session_token }` oder `{ mfa_setup_required, setup_token }` |
| `/api/mfa-setup` | POST | QR-Code + Secret generieren, in KV speichern |
| `/api/mfa-verify` | POST | TOTP-Code verifizieren → GitHub-Token zurück |

### Login-Flow
```
Passwort eingeben
  → Passwort falsch? → Fehler
  → Passwort richtig + kein TOTP-Secret in KV? → MFA-Setup (QR-Code)
  → Passwort richtig + TOTP-Secret vorhanden? → TOTP-Code eingeben
    → Code korrekt? → GitHub-Token → Admin geladen
    → Code falsch? → Fehler (max 5 Versuche, dann 15min Lock)
```

### Recovery-Codes
- 8 einmalige Codes, bei Setup generiert und angezeigt
- Jeder Code nur einmal verwendbar (wird aus KV entfernt nach Nutzung)
- Alternative zu TOTP falls Handy verloren

## 2. Admin-Vorschau mit Inline-Editing

### Konzept
Statt Formular-Editor sieht Runa eine **gestylte Vorschau** der Seite im Admin. Klick auf Textbereich öffnet Inline-Edit-Feld.

### Preview-Templates
| Template | Für | Editierbare Bereiche |
|---|---|---|
| `HomePreview` | `home.md` | Hero (Titel, Subtitle, CTA), Angebote-Grid, Philosophie-Zitat, Über mich, Retreat, Testimonials |
| `PagePreview` | `pages/*.md` | Titel, Subtitle, Body (Rich-Text) |
| `AngebotPreview` | `angebote/*.md` | Titel, Subtitle, Beschreibung, Highlights, Bild |
| `BlogPreview` | `blog/*.md` | Titel, Datum, Autor, Excerpt, Body (Rich-Text) |
| `PreisePreview` | `preise.md` | Preisgruppen + Karten (strukturiert) |
| `SiteDataEditor` | `site.md` | Bleibt Formular (Name, E-Mail, Telefon etc.) |

### Inline-Edit UX
- Editierbare Bereiche: leichter Hover-Effekt (gestrichelte Umrandung + Stift-Icon)
- Klick → Inline-Textfeld oder Popup-Editor
- Body-Markdown → Mini-WYSIWYG (contenteditable + Toolbar: Bold, Italic, Link, Liste, Heading)
- Bilder → Klick öffnet Upload-Dialog
- Listen/Arrays → "+" Button unter dem letzten Element
- ESC = Abbrechen, Änderungen werden gesammelt und mit "Speichern" committed

### Toggle "Rohansicht"
- Button oben rechts: "Vorschau / Formular"
- Formular-Ansicht = aktuelles Admin-Panel (für Power-User / Debugging)

### CSS
- Gleiche `styles.css` wie Live-Seite wird im Admin geladen
- Preview in einem Container mit `class="site-preview"` (isoliert vom Admin-CSS)
- Editierbare Felder bekommen `[data-field="hero_title"]` Attribute

## 3. Theme-Presets + Farb-Picker

### 5 Theme-Presets
| Preset | Primary | Primary Light | Primary Dark | Accent | Background | Text |
|---|---|---|---|---|---|---|
| Sage (Standard) | #7a8b6f | #9aab8f | #5a6b4f | #c4956a | #f5f0e8 | #2d3436 |
| Ocean | #4a7c8e | #6a9cae | #3a6c7e | #e8a87c | #f0f4f5 | #2c3e50 |
| Sunset | #b06846 | #d08866 | #905836 | #d4a574 | #faf5f0 | #3d2b1f |
| Lavender | #8b7a9e | #ab9abe | #6b5a7e | #c49a6a | #f5f0f8 | #2d2636 |
| Earth | #6b7355 | #8b9375 | #4b5335 | #a08060 | #f4f0e8 | #2d3426 |

### Farb-Picker
- 6 anpassbare CSS-Variablen: `--primary`, `--primary-light`, `--primary-dark`, `--accent`, `--background`, `--text`
- Native `<input type="color">` + Hex-Textfeld
- Preset wählen → Farben werden gesetzt → einzelne Farben feinjustieren

### Speicherung
```yaml
# site.md frontmatter
theme_preset: sage
colors:
  primary: "#7a8b6f"
  primary_light: "#9aab8f"
  primary_dark: "#5a6b4f"
  accent: "#c4956a"
  background: "#f5f0e8"
  text: "#2d3436"
```

### Live-Preview
- Im Admin: CSS Custom Properties werden sofort per JS gesetzt → Vorschau aktualisiert sich
- Auf Live-Seite: erst nach Build (Astro liest `site.md` → setzt CSS Vars in `BaseLayout.astro`)

## 4. Template-Tauglichkeit

Diese Seite dient als Template für weitere Projekte:
- Admin-Panel ist generisch (auto-discover Content-Dateien)
- Theme-System über CSS Vars (nicht hartcodiert)
- Auth-System wiederverwendbar (nur KV-Namespace + Env-Vars ändern)
- Preview-Templates als Muster für neue Seitentypen

### Was bei neuem Projekt angepasst wird
- `REPO` Konstante im Admin
- CF Pages Projekt + KV Namespace
- Content-Dateien (Markdown-Struktur)
- Preview-Templates (seitenspezifisch)
- Theme-Presets (projektspezifisch)
- `functions/` Env-Vars (ADMIN_PASSWORD, GITHUB_TOKEN)

## Technische Entscheidungen

| Thema | Entscheidung | Grund |
|---|---|---|
| TOTP Library | `otpauth` (ESM) | CF Workers kompatibel, klein, gut maintained |
| MFA Storage | Cloudflare KV | Serverless, kein DB nötig, persistent |
| Rich-Text Editor | Eigener Mini-Editor (contenteditable) | Kein Tiptap/ProseMirror (zu groß für CF Pages) |
| Theme-Speicher | `site.md` Frontmatter | Konsistent mit restlichem Content-Modell |
| Preview CSS | Gleiche `styles.css` | Identisches Aussehen garantiert |

## Was sich NICHT ändert

- Cloudflare Pages Hosting
- GitHub als Content-Backend
- Astro als SSG
- URL-Schema
- Bestehendes Content-Modell (nur `site.md` bekommt Theme-Felder dazu)
