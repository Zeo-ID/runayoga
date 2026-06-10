"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal.
 * Adds `.js-reveal` to <html> (so sections start hidden ONLY when JS runs),
 * then reveals each <main> section / [data-reveal] element as it enters view.
 * If JS is disabled, everything stays visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("main section, [data-reveal]")
    );

    // Avoid hiding above-the-fold content that's already on screen at load.
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        // Already visible at load → reveal with a tiny stagger, no scroll needed.
        window.setTimeout(() => el.classList.add("is-visible"), Math.min(i, 4) * 90);
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return null;
}
