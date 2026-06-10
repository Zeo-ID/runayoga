/**
 * Mehrsprachigkeit (i18n) für Runayoga.
 * Deutsch ist Standard und liegt auf den Wurzel-Adressen (/, /angebote, …).
 * Andere Sprachen liegen unter einem Präfix (/en/…, /pl/…, /tr/…, /ru/…, /ar/…).
 * Übersetzte Inhalte liegen unter src/content/<locale>/ (Deutsch: src/content/).
 */

export type Locale = "de" | "en" | "pl" | "tr" | "ru" | "ar";

export const DEFAULT_LOCALE: Locale = "de";

export interface LocaleInfo {
  code: Locale;
  label: string;
  dir: "ltr" | "rtl";
}

export const LOCALES: LocaleInfo[] = [
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "pl", label: "Polski", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const LOCALE_CODES: Locale[] = LOCALES.map((l) => l.code);
export const NON_DEFAULT_LOCALES: LocaleInfo[] = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE);

export function isLocale(s: string | undefined): s is Locale {
  return !!s && (LOCALE_CODES as string[]).includes(s);
}

export function localeInfo(code: Locale): LocaleInfo {
  return LOCALES.find((l) => l.code === code) || LOCALES[0];
}

export function dirOf(code: Locale): "ltr" | "rtl" {
  return localeInfo(code).dir;
}

/** Zerlegt einen URL-Pfad in Locale + den restlichen (deutschen) Basis-Pfad. */
export function splitLocale(urlPath: string): { locale: Locale; basePath: string } {
  const segs = urlPath.replace(/^\//, "").split("/").filter(Boolean);
  if (segs[0] && isLocale(segs[0]) && segs[0] !== DEFAULT_LOCALE) {
    const rest = "/" + segs.slice(1).join("/");
    return { locale: segs[0] as Locale, basePath: rest === "/" ? "/" : rest };
  }
  return { locale: DEFAULT_LOCALE, basePath: urlPath || "/" };
}

/** Baut aus einem Basis-Pfad (deutsch) die Adresse in einer Ziel-Sprache. */
export function localizedHref(locale: Locale, basePath: string): string {
  const clean = basePath === "" ? "/" : basePath.startsWith("/") ? basePath : "/" + basePath;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
