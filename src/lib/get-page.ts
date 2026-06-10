import fs from "fs";
import path from "path";
import { DEFAULT_LOCALE, NON_DEFAULT_LOCALES, splitLocale, localizedHref, type Locale } from "./i18n";

/**
 * Load page content from a JSON file at build time.
 * Deutsch: src/content/…  ·  andere Sprachen: src/content/<locale>/…
 *   /            → content/home.json
 *   /angebote    → content/seiten/angebote.json
 *   /en/angebote → content/en/seiten/angebote.json
 *   /blog/xyz    → content/blog/xyz.json
 */
function contentRoot(locale: Locale): string {
  const base = path.join(process.cwd(), "src", "content");
  return locale === DEFAULT_LOCALE ? base : path.join(base, locale);
}

function fileForBasePath(locale: Locale, basePath: string): string {
  const dir = contentRoot(locale);
  if (basePath === "/" || basePath === "") return path.join(dir, "home.json");
  const segments = basePath.replace(/^\//, "").split("/");
  if (segments[0] === "blog" && segments[1]) return path.join(dir, "blog", `${segments[1]}.json`);
  if (segments[0] === "angebote" && segments[1]) return path.join(dir, "angebote", `${segments[1]}.json`);
  return path.join(dir, "seiten", `${segments[0]}.json`);
}

export function getPage(urlPath: string): any | null {
  const { locale, basePath } = splitLocale(urlPath);
  let data = readJson(fileForBasePath(locale, basePath));
  // Fallback: fehlt eine Übersetzung, deutsche Fassung ausliefern (kein 404)
  if (!data && locale !== DEFAULT_LOCALE) data = readJson(fileForBasePath(DEFAULT_LOCALE, basePath));
  if (!data) return null;
  return withLocale(data, locale);
}

/** Prop-Keys, deren Wert ein interner Link ist (→ Sprachpräfix). image/src bleiben unangetastet. */
const LINK_KEYS = new Set(["buttonLink", "secondButtonLink", "link"]);

/** Präfigiert interne Links rekursiv mit der aktiven Sprache. */
function localizeLinks(value: any, locale: Locale): any {
  if (Array.isArray(value)) return value.map((v) => localizeLinks(v, locale));
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] =
        LINK_KEYS.has(k) && typeof v === "string" && v.startsWith("/") && !v.startsWith("/images")
          ? localizedHref(locale, v)
          : localizeLinks(v, locale);
    }
    return out;
  }
  return value;
}

/**
 * Reicht die aktive Sprache an Blöcke weiter (locale-Prop) und präfigiert
 * interne Links (buttonLink/secondButtonLink/link) mit dem Sprachsegment,
 * damit Navigation innerhalb von /en, /pl … die Sprache beibehält.
 */
function withLocale(data: any, locale: Locale): any {
  if (!data || !Array.isArray(data.content)) return data;
  const content = data.content.map((block: any) => {
    if (!block || typeof block !== "object") return block;
    const localized = localizeLinks(block, locale);
    return { ...localized, props: { ...localized.props, locale } };
  });
  return { ...data, content };
}

function readJson(filePath: string): any | null {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
}

/** Alle deutschen Basis-Pfade (inkl. "/"). */
export function getAllPaths(): string[] {
  const paths: string[] = ["/"];
  const contentDir = path.join(process.cwd(), "src", "content");

  for (const sub of ["seiten", "blog", "angebote"]) {
    const dir = path.join(contentDir, sub);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(".json", "");
      paths.push(sub === "seiten" ? `/${slug}` : `/${sub}/${slug}`);
    }
  }
  return paths;
}

/**
 * Alle Pfade für die statische Generierung der Catch-all-Route, OHNE "/"
 * (die deutsche Startseite liegt in app/page.tsx). Für jede Nicht-Standard-Sprache
 * werden die Startseite (z. B. /en) und alle Unterseiten (/en/angebote …) ergänzt.
 */
export function getAllStaticParams(): string[][] {
  const base = getAllPaths().filter((p) => p !== "/");
  const params: string[][] = base.map((p) => p.replace(/^\//, "").split("/"));
  for (const l of NON_DEFAULT_LOCALES) {
    params.push([l.code]);
    for (const p of base) {
      params.push([l.code, ...p.replace(/^\//, "").split("/")]);
    }
  }
  return params;
}
