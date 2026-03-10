/* ===================================================
   Runayoga — Shared Components & Interactions
   All HTML injected by this file is static/hardcoded
   content — no user input is used, so innerHTML is safe.
   =================================================== */

(function () {
  'use strict';

  /* ---------- Header ---------- */
  function renderHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    // Static hardcoded markup — safe to use innerHTML
    header.innerHTML = [
      '<nav class="nav" id="main-nav">',
      '  <div class="nav-inner">',
      '    <a href="/" class="nav-logo">',
      '      <img src="/images/logo.png" alt="Runayoga" style="height:45px">',
      '    </a>',
      '    <ul class="nav-links" id="nav-links">',
      '      <li class="nav-dropdown" id="nav-dropdown-angebot">',
      '        <a href="/angebote.html">Angebot <span class="dropdown-arrow">&#9662;</span></a>',
      '        <ul class="dropdown-menu">',
      '          <li><a href="/yoga.html">Yoga</a></li>',
      '          <li><a href="/pilates.html">Pilates</a></li>',
      '          <li><a href="/massagen.html">Massagen</a></li>',
      '          <li><a href="/heilraum.html">Heilraum</a></li>',
      '          <li><a href="/mantra.html">Mantra</a></li>',
      '          <li><a href="/jahreskreis.html">Jahreskreis</a></li>',
      '        </ul>',
      '      </li>',
      '      <li><a href="/ueber-mich.html">\u00dcber mich</a></li>',
      '      <li><a href="/retreat.html">Retreat</a></li>',
      '      <li><a href="/preise.html">Preise</a></li>',
      '      <li><a href="/blog.html">Blog</a></li>',
      '      <li><a href="/kontakt.html" class="btn btn-primary">Kontakt</a></li>',
      '    </ul>',
      '    <button class="hamburger" id="hamburger" aria-label="Men\u00fc \u00f6ffnen">',
      '      <span></span><span></span><span></span>',
      '    </button>',
      '  </div>',
      '</nav>'
    ].join('\n');
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    var footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.classList.add('site-footer');

    // Static hardcoded markup — safe to use innerHTML
    footer.innerHTML = [
      '<div class="container">',
      '  <div class="footer-grid">',
      '    <div class="footer-brand">',
      '      <a href="/">',
      '        <img src="/images/logo.png" alt="Runayoga" style="height:40px">',
      '      </a>',
      '      <p>Yoga, Pilates &amp; Massage in Berlin-Pankow. Finde deine Balance \u2014 auf und neben der Matte.</p>',
      '      <div class="footer-contact-info">',
      '        <p>runabulla@gmail.com</p>',
      '        <p>+49 163 139 1059</p>',
      '        <p>Berlin-Pankow</p>',
      '      </div>',
      '    </div>',
      '',
      '    <div>',
      '      <h4 class="footer-heading">Quicklinks</h4>',
      '      <ul class="footer-links">',
      '        <li><a href="/angebote.html">Angebot</a></li>',
      '        <li><a href="/ueber-mich.html">\u00dcber mich</a></li>',
      '        <li><a href="/retreat.html">Retreat</a></li>',
      '        <li><a href="/blog.html">Blog</a></li>',
      '        <li><a href="/kontakt.html">Kontakt</a></li>',
      '      </ul>',
      '    </div>',
      '',
      '    <div>',
      '      <h4 class="footer-heading">Rechtliches</h4>',
      '      <ul class="footer-links">',
      '        <li><a href="/impressum.html">Impressum</a></li>',
      '        <li><a href="/datenschutz.html">Datenschutz</a></li>',
      '      </ul>',
      '      <div class="footer-social">',
      '        <a href="https://www.instagram.com/runayoga_berlin/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">',
      '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      '        </a>',
      '        <a href="mailto:runabulla@gmail.com" aria-label="E-Mail">',
      '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      '        </a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="footer-bottom">',
      '    <p>\u00a9 2026 Runayoga. Alle Rechte vorbehalten.</p>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /* ---------- Scroll — nav shadow ---------- */
  function initScrollNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hamburger ---------- */
  function initHamburger() {
    var btn = document.getElementById('hamburger');
    var links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function () {
      btn.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close menu on link click (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        // Don't close if it's the dropdown parent on mobile
        if (a.closest('.nav-dropdown') && a === a.closest('.nav-dropdown').querySelector(':scope > a')) {
          return;
        }
        btn.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  /* ---------- Mobile Dropdown ---------- */
  function initMobileDropdown() {
    var dropdown = document.getElementById('nav-dropdown-angebot');
    if (!dropdown) return;

    var toggle = dropdown.querySelector(':scope > a');

    toggle.addEventListener('click', function (e) {
      // Only toggle on mobile
      if (window.innerWidth <= 968) {
        e.preventDefault();
        dropdown.classList.toggle('dropdown-open');
      }
    });
  }

  /* ---------- Active Nav Link ---------- */
  function setActiveNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a:not(.btn)');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      // Exact match or starts-with for sub-pages
      if (path === href || (href !== '/' && path.startsWith(href.replace('.html', '')))) {
        link.classList.add('active');

        // If inside dropdown, also mark parent
        var parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          var parentLink = parentDropdown.querySelector(':scope > a');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
  }

  /* ---------- Intersection Observer — fade-in ---------- */
  function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var offset = 80; // fixed nav height
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    initScrollNav();
    initHamburger();
    initMobileDropdown();
    setActiveNav();
    initFadeIn();
    initSmoothScroll();
  });
})();
