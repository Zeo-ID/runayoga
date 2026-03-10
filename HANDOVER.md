# Runayoga Website - Projektübergabe

## Projekt-Status: Redesign fertig, Deployment ausstehend

---

## Repository

- **GitHub**: https://github.com/Zeo-ID/runayoga
- **Branch**: `main`
- **Zugang**: GitHub-User `Zeo-ID`

---

## Dateistruktur

```
runayoga/
├── index.html          # Komplette Website (HTML + CSS + JS)
├── images/
│   ├── logo.png        # Runayoga-Logo (6.7 KB)
│   ├── hero.jpg        # Hero-Bild: Yoga auf Steg (532 KB)
│   ├── about.jpg       # Über-mich-Bild: Blumengarten (861 KB)
│   └── retreat.jpg     # Retreat-Bild: Mittelmeer (1.2 MB)
├── HANDOVER.md         # Diese Datei
└── .claude/
    └── launch.json     # Dev-Server Konfiguration
```

---

## Tech-Stack

| Komponente | Technologie |
|---|---|
| HTML/CSS/JS | Alles in einer Datei (`index.html`) |
| Fonts | Google Fonts: Cormorant Garamond + Inter |
| Icons | Inline SVG (keine externen Abhängigkeiten) |
| Animationen | IntersectionObserver (Scroll-Fade-In) |
| Responsive | CSS Grid + Media Queries (Breakpoints: 968px, 600px) |
| Build-Prozess | Keiner - statische Dateien |

---

## Farbpalette (CSS Custom Properties)

```css
--sage: #7a8b6f        /* Hauptfarbe (Salbeigrün) */
--sage-light: #9aab8f
--sage-dark: #5a6b4f
--cream: #f5f0e8        /* Hintergrund */
--warm-white: #faf8f5
--sand: #d4c5a9
--earth: #8b7355
--accent: #c4956a       /* Akzentfarbe */
```

---

## Deployment (Cloudflare Pages)

### Schritte:

1. **Cloudflare Dashboard** aufrufen: https://dash.cloudflare.com
2. **Workers & Pages** > **Create** > **Pages** > **Connect to Git**
3. GitHub-Repo `Zeo-ID/runayoga` auswählen
4. Build-Einstellungen:
   - **Framework preset**: `None`
   - **Build command**: *(leer lassen)*
   - **Build output directory**: `/`
5. **Save and Deploy** klicken
6. Die Seite ist dann unter `runayoga.pages.dev` erreichbar

### Custom Domain (optional):

- In Cloudflare Pages > Custom Domains > `runayoga.de` hinzufügen
- DNS-Einträge bei Domain-Provider anpassen (CNAME auf `runayoga.pages.dev`)

---

## Kontaktdaten im Code

| Feld | Wert |
|---|---|
| E-Mail | runabulla@gmail.com |
| WhatsApp | +49 163 139 1059 |
| Instagram | @runayoga (Link muss noch aktualisiert werden) |
| Standort | Berlin-Pankow |

---

## Sektionen der Website

1. **Navigation** - Fixiert, Scroll-Effekt, mobiles Hamburger-Menü
2. **Hero** - Bild + Text, CTA-Button
3. **Angebote** - 6 Karten (Pilates, Massagen, Yoga, Heilraum, Retreat, Mantra singen)
4. **Philosophie** - Zitat-Sektion
5. **Über mich** - Text + Bild
6. **Retreat** - Highlight-Sektion
7. **Stimmen** - Testimonials (Platzhalter)
8. **Kontakt** - E-Mail, WhatsApp, Instagram
9. **Footer**

---

## Offene Punkte

### Priorität 1 (vor Go-Live):
- [ ] **Impressum** erstellen (gesetzlich vorgeschrieben in DE)
- [ ] **Datenschutzerklärung** erstellen (DSGVO)
- [ ] **Instagram-Link** aktualisieren (echter Profil-Link)
- [ ] **Cloudflare Pages** einrichten und deployen

### Priorität 2 (nach Go-Live):
- [ ] Echte **Testimonials** von Kundinnen einholen
- [ ] **AGB** erstellen (falls Buchungsfunktion kommt)
- [ ] **Google Maps** Einbindung für Standort
- [ ] **SEO Meta-Tags** optimieren (description, og:image, etc.)
- [ ] **Newsletter-Integration** (z.B. Mailchimp)
- [ ] **Favicon** erstellen und einbinden
- [ ] Bilder komprimieren (besonders retreat.jpg mit 1.2 MB)

### Priorität 3 (optional):
- [ ] Online-Buchungssystem
- [ ] Blog/Aktuelles-Sektion
- [ ] Mehrsprachigkeit (DE/EN)
- [ ] Cookie-Banner (falls Analytics eingebaut wird)

---

## Lokale Entwicklung

```bash
# Repo klonen
git clone https://github.com/Zeo-ID/runayoga.git
cd runayoga

# Einfach index.html im Browser öffnen
# Oder mit einem lokalen Server:
python3 -m http.server 8000
# Dann http://localhost:8000 aufrufen
```

---

## Hinweise

- Alle Bilder sind **lokal gespeichert** (nicht von externen CDNs abhängig)
- Die Website ist **komplett statisch** - kein Backend, keine Datenbank
- Hosting-Kosten: **0 EUR** (Cloudflare Pages Free Tier)
- Änderungen einfach per `git push` deployen (automatisches Rebuild)

---

*Erstellt am 10.03.2026*
