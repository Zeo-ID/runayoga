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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav: NavItem[] = siteData.navigation || [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Wordmark = siteData.logo ? (
    <img src={siteData.logo} alt={siteData.name} className="h-[42px] w-auto" />
  ) : (
    <span style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "1.5rem", letterSpacing: "-.01em", color: "var(--color-text)" }}>
      {siteData.name}
    </span>
  );

  return (
    <header
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: scrolled ? "rgba(243,235,225,.88)" : "rgba(243,235,225,.6)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "background .4s ease, border-color .4s ease",
      }}
    >
      <div className="container flex items-center justify-between px-6 md:px-8" style={{ paddingTop: ".9rem", paddingBottom: ".9rem" }}>
        <a href="/" className="flex items-center gap-3">{Wordmark}</a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-7" ref={dropdownRef}>
          {nav.map((item, i) =>
            item.children && item.children.length > 0 ? (
              <div key={i} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                  className="nav-link flex items-center gap-1"
                >
                  {item.label}
                  <span className="text-[.6rem] transition-transform duration-300" style={{ transform: openDropdown === i ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {openDropdown === i && (
                  <div
                    className="absolute left-1/2 mt-4 min-w-[210px] py-2"
                    style={{ transform: "translateX(-50%)", background: "var(--color-bg-cream)", borderRadius: "14px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)" }}
                  >
                    <a href={item.href} className="nav-drop" onClick={() => setOpenDropdown(null)}>Alle {item.label}</a>
                    {item.children.map((child, j) => (
                      <a key={j} href={child.href} className="nav-drop" onClick={() => setOpenDropdown(null)}>{child.label}</a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={i} href={item.href} className="nav-link">{item.label}</a>
            )
          )}
          <a href="/kontakt" className="btn-primary" style={{ padding: ".62rem 1.4rem", fontSize: ".88rem" }}>Termin</a>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1 cursor-pointer" aria-label="Menü">
          <div className="flex flex-col gap-[5px]">
            <span className="block w-6 h-[2px] rounded-sm transition-transform duration-300" style={{ background: "var(--color-text)", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span className="block w-6 h-[2px] rounded-sm transition-opacity duration-300" style={{ background: "var(--color-text)", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-[2px] rounded-sm transition-transform duration-300" style={{ background: "var(--color-text)", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden px-7 py-6 flex flex-col" style={{ background: "var(--color-bg-cream)", boxShadow: "var(--shadow-md)", borderTop: "1px solid var(--color-border)" }}>
          {nav.map((item, i) => (
            <div key={i}>
              <a href={item.href} onClick={() => setMenuOpen(false)} className="block py-3 text-[1rem] font-medium" style={{ fontFamily: "Fraunces, serif" }}>{item.label}</a>
              {item.children && item.children.map((child, j) => (
                <a key={j} href={child.href} onClick={() => setMenuOpen(false)} className="block py-2 pl-4 text-[.92rem]" style={{ color: "var(--color-text-muted)" }}>{child.label}</a>
              ))}
            </div>
          ))}
          <a href="/kontakt" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ marginTop: "1.2rem", justifyContent: "center" }}>Termin vereinbaren</a>
        </nav>
      )}

      <style>{`
        .nav-link {
          font-size: .92rem; font-weight: 500; color: var(--color-text);
          position: relative; transition: color var(--transition);
          background: none; border: none; cursor: pointer; font-family: "Inter", sans-serif;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 1.5px;
          background: var(--color-primary); transition: width var(--transition);
        }
        .nav-link:hover { color: var(--color-primary); }
        .nav-link:hover::after { width: 100%; }
        .nav-drop {
          display: block; padding: .55rem 1.2rem; font-size: .9rem; white-space: nowrap;
          color: var(--color-text-light); transition: background var(--transition), color var(--transition);
        }
        .nav-drop:hover { background: rgba(191,106,74,.09); color: var(--color-primary); }
      `}</style>
    </header>
  );
}
