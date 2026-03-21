"use client";

import { useState, useRef, useEffect } from "react";
import siteData from "../../data/site.json";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav: NavItem[] = siteData.navigation || [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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
        <nav className="hidden md:flex items-center gap-8" ref={dropdownRef}>
          {nav.map((item, i) =>
            item.children && item.children.length > 0 ? (
              <div key={i} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                  className="text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 5l3 3 3-3" />
                  </svg>
                </button>
                {openDropdown === i && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-2 min-w-[180px]">
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-sm text-[var(--color-text-light)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Alle {item.label}
                    </a>
                    {item.children.map((child, j) => (
                      <a
                        key={j}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-[var(--color-text-light)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={i}
                href={item.href}
                className="text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
              >
                {item.label}
              </a>
            )
          )}
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
        <nav className="md:hidden border-t border-[var(--color-border)] bg-white px-6 py-4 space-y-1">
          {nav.map((item, i) => (
            <div key={i}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
              >
                {item.label}
              </a>
              {item.children && item.children.map((child, j) => (
                <a
                  key={j}
                  href={child.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 pl-4 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
                >
                  {child.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
