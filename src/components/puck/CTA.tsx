"use client";

export function CTA({
  title,
  text,
  buttonText,
  buttonLink,
  variant = "primary",
}: {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  variant: "primary" | "accent" | "dark";
}) {
  const bg =
    variant === "accent"
      ? "var(--color-accent)"
      : variant === "dark"
      ? "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))"
      : "var(--color-primary)";

  return (
    <section className="section-padding">
      <div
        className="max-w-[1200px] mx-auto text-white text-center relative overflow-hidden"
        style={{
          background: bg,
          borderRadius: "var(--radius)",
          padding: "4rem 2rem",
        }}
      >
        <h2
          className="font-heading text-white mb-3"
          style={{ fontSize: "2.4rem", fontWeight: 500, lineHeight: 1.2 }}
        >
          {title}
        </h2>
        <p
          className="mx-auto mb-6"
          style={{ color: "rgba(255,255,255,.85)", maxWidth: 500, fontSize: "1.05rem" }}
        >
          {text}
        </p>
        {buttonText && (
          <a
            href={buttonLink}
            className="inline-flex items-center"
            style={{
              background: "#fff",
              color: "var(--color-primary)",
              fontWeight: 500,
              padding: ".85rem 2rem",
              borderRadius: "50px",
              fontSize: ".95rem",
              textDecoration: "none",
              transition: "transform var(--transition), box-shadow var(--transition)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
