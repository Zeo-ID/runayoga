"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, splitLocale, localizedHref } from "../../lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname() || "/";
  const { locale, basePath } = splitLocale(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Sprache wählen / Choose language"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "1px solid var(--color-border)",
          borderRadius: 999,
          padding: compact ? "5px 10px" : "6px 11px",
          color: "var(--color-text)",
          fontSize: ".82rem",
          fontWeight: 500,
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
        </svg>
        <span>{current.code.toUpperCase()}</span>
        <span style={{ fontSize: ".6rem", transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            minWidth: 150,
            background: "var(--color-bg-cream)",
            borderRadius: 12,
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--color-border)",
            padding: 6,
            zIndex: 60,
          }}
        >
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <a
                key={l.code}
                href={localizedHref(l.code, basePath)}
                onClick={() => setOpen(false)}
                dir={l.dir}
                aria-current={active ? "true" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: ".9rem",
                  textDecoration: "none",
                  color: active ? "var(--color-primary)" : "var(--color-text-light)",
                  fontWeight: active ? 600 : 400,
                  background: active ? "rgba(191,106,74,.09)" : "transparent",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(191,106,74,.06)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{l.label}</span>
                <span style={{ fontSize: ".7rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>{l.code}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
