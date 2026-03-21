"use client";

import { useState } from "react";
import siteData from "../../data/site.json";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = siteData.navigation || [];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          {siteData.logo && (
            <img src={siteData.logo} alt={siteData.name} className="h-8" />
          )}
          <span className="font-heading font-bold text-lg text-[var(--color-text)]">
            {siteData.name}
          </span>
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[var(--color-text)]"
          aria-label="Menü"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-white px-6 py-4 space-y-3">
          {nav.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
