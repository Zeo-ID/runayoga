"use client";

import { usePathname } from "next/navigation";
import { splitLocale, type Locale } from "./i18n";

export function useLocale(): Locale {
  return splitLocale(usePathname() || "/").locale;
}

export function useBasePath(): string {
  return splitLocale(usePathname() || "/").basePath;
}
