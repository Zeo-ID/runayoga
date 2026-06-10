export function RichText({ content }: { content: string }) {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Soft organic accents — warm, low-opacity, asymmetric */}
      <div
        className="blob"
        aria-hidden="true"
        style={{
          width: 360,
          height: 360,
          background: "rgba(217,169,143,.18)",
          top: "-110px",
          right: "-120px",
          zIndex: 0,
        }}
      />
      <div
        className="blob"
        aria-hidden="true"
        style={{
          width: 300,
          height: 300,
          background: "rgba(191,106,74,.08)",
          bottom: "-120px",
          left: "-110px",
          zIndex: 0,
        }}
      />

      {/* Editorial reading column — comfortable measure (~70ch), refined */}
      <article
        className="prose prose-lg relative"
        style={{
          zIndex: 1,
          maxWidth: "70ch",
          margin: "0 auto",
          fontSize: "1.1rem",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Per-instance refinements layered onto the global .prose system */}
      <style>{`
        section > article.prose > :first-child { margin-top: 0; }
        section > article.prose > :last-child { margin-bottom: 0; }

        /* Generous, editorial vertical rhythm */
        section > article.prose p {
          font-size: 1.1rem;
          line-height: 1.82;
          margin-bottom: 1.35rem;
        }

        /* Opening paragraph: a touch larger, sets a magazine tone */
        section > article.prose > p:first-of-type {
          font-size: 1.22rem;
          line-height: 1.7;
          color: var(--color-text);
        }

        /* Drop-cap initial on the lead paragraph — editorial flourish */
        section > article.prose > p:first-of-type::first-letter {
          font-family: "Fraunces", serif;
          font-weight: 500;
          font-size: 3.6rem;
          line-height: .82;
          float: left;
          margin: .08em .12em -.04em 0;
          color: var(--color-primary);
        }

        /* Headings: airier spacing, subtle kicker tick before H2 */
        section > article.prose h2 {
          margin-top: 2.8rem;
          position: relative;
        }
        section > article.prose h2::before {
          content: "";
          display: block;
          width: 38px;
          height: 2px;
          border-radius: 2px;
          background: var(--color-primary);
          margin-bottom: 1.05rem;
        }
        section > article.prose h3 { margin-top: 2rem; }

        /* Blockquote: warm pull-quote with rosé backdrop */
        section > article.prose blockquote {
          position: relative;
          background: var(--color-bg-cream);
          border-left: 3px solid var(--color-primary);
          border-radius: 0 var(--radius) var(--radius) 0;
          padding: 1.6rem 1.8rem 1.6rem 2rem;
          margin: 2.4rem 0;
          box-shadow: var(--shadow-sm);
        }

        /* Links: refined underline that warms on hover */
        section > article.prose a {
          text-decoration-color: var(--color-rose);
          transition: text-decoration-color var(--transition), color var(--transition);
        }
        section > article.prose a:hover {
          color: var(--color-primary-dark);
          text-decoration-color: var(--color-primary);
        }

        /* Images: organic soft frame + warm shadow */
        section > article.prose img {
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          margin: 2rem 0;
        }

        /* Horizontal rules become a centered editorial mark */
        section > article.prose hr {
          border: 0;
          height: auto;
          text-align: center;
          margin: 2.8rem 0;
        }
        section > article.prose hr::before {
          content: "✦";
          color: var(--color-rose);
          font-size: 1rem;
          letter-spacing: .5em;
        }

        @media (max-width: 640px) {
          section > article.prose > p:first-of-type { font-size: 1.12rem; }
          section > article.prose > p:first-of-type::first-letter { font-size: 3rem; }
        }
      `}</style>
    </section>
  );
}
