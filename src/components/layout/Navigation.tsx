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
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: "rgba(245,240,232,.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-4">
        <a href="/" className="flex items-center gap-3">
          {siteData.logo && (
            <img src={siteData.logo} alt={siteData.name} className="h-[45px] w-auto" />
          )}
        </a>

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
                  <span
                    className="text-[.65rem] transition-transform duration-300"
                    style={{ transform: openDropdown === i ? "rotate(180deg)" : "none" }}
                  >
                    ▼
                  </span>
                </button>
                {openDropdown === i && (
                  <div
                    className="absolute left-1/2 mt-3 min-w-[200px] py-2"
                    style={{
                      transform: "translateX(-50%)",
                      background: "var(--color-bg-alt)",
                      borderRadius: "12px",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    <a
                      href={item.href}
                      className="block px-5 py-2 text-[.9rem] whitespace-nowrap hover:text-[var(--color-primary)]"
                      style={{ transition: "background var(--transition), color var(--transition)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(122,139,111,.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      onClick={() => setOpenDropdown(null)}
                    >
                      Alle {item.label}
                    </a>
                    {item.children.map((child, j) => (
                      <a
                        key={j}
                        href={child.href}
                        className="block px-5 py-2 text-[.9rem] whitespace-nowrap hover:text-[var(--color-primary)]"
                        style={{ transition: "background var(--transition), color var(--transition)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(122,139,111,.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={i} href={item.href} className="nav-link">
                {item.label}
              </a>
            )
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1 cursor-pointer"
          aria-label="Menü"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className="block w-6 h-[2px] rounded-sm transition-transform duration-300"
              style={{
                background: "var(--color-text)",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-6 h-[2px] rounded-sm transition-opacity duration-300"
              style={{
                background: "var(--color-text)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-[2px] rounded-sm transition-transform duration-300"
              style={{
                background: "var(--color-text)",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden px-8 py-6 flex flex-col gap-0"
          style={{
            background: "var(--color-bg-alt)",
            boxShadow: "var(--shadow-md)",
            borderTop: "1px solid rgba(0,0,0,.05)",
          }}
        >
          {nav.map((item, i) => (
            <div key={i}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[.95rem] font-normal hover:text-[var(--color-primary)] transition-colors"
              >
                {item.label}
              </a>
              {item.children &&
                item.children.map((child, j) => (
                  <a
                    key={j}
                    href={child.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 pl-4 text-[.9rem] hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {child.label}
                  </a>
                ))}
            </div>
          ))}
        </nav>
      )}

      <style>{`
        .nav-link {
          font-size: .92rem;
          font-weight: 400;
          color: var(--color-text);
          position: relative;
          transition: color var(--transition);
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width var(--transition);
        }
        .nav-link:hover { color: var(--color-primary); }
        .nav-link:hover::after { width: 100%; }
      `}</style>
    </header>
  );
}
