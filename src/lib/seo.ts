import siteData from "../data/site.json";

const site = siteData as {
  name: string;
  tagline: string;
  url?: string;
  logo?: string;
  ogImage?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    instagram?: string;
  };
  openingHours?: { day: string; time: string }[];
};

export function getSiteUrl(): string {
  return (site.url || "").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!base) return path;
  if (!path) return base;
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildOpenGraph(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}) {
  const title = opts.title || site.name;
  const description = opts.description || site.tagline;
  const url = absoluteUrl(opts.path || "/");
  const image = absoluteUrl(opts.image || site.ogImage || site.logo || "");

  return {
    title,
    description,
    url,
    siteName: site.name,
    locale: "de_DE",
    type: opts.type || "website",
    images: image ? [{ url: image, alt: title }] : undefined,
  };
}

export function buildTwitter(opts: {
  title?: string;
  description?: string;
  image?: string;
}) {
  const image = opts.image ? absoluteUrl(opts.image) : undefined;
  return {
    card: "summary_large_image" as const,
    title: opts.title || site.name,
    description: opts.description || site.tagline,
    images: image ? [image] : undefined,
  };
}

export function organizationJsonLd() {
  const c = site.contact || {};
  const sameAs = [c.instagram].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.tagline,
    url: getSiteUrl() || undefined,
    image: site.ogImage ? absoluteUrl(site.ogImage) : undefined,
    logo: site.logo ? absoluteUrl(site.logo) : undefined,
    email: c.email,
    telephone: c.phone,
    address: c.address
      ? { "@type": "PostalAddress", streetAddress: c.address }
      : undefined,
    openingHoursSpecification: site.openingHours?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      description: h.time,
    })),
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image ? absoluteUrl(opts.image) : undefined,
    datePublished: opts.datePublished,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: site.logo
        ? { "@type": "ImageObject", url: absoluteUrl(site.logo) }
        : undefined,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function findHero(content: unknown[]): {
  title?: string;
  subtitle?: string;
  image?: string;
} | null {
  if (!Array.isArray(content)) return null;
  for (const block of content) {
    const b = block as { type?: string; props?: Record<string, string> };
    if (b?.type === "Hero") return b.props || {};
  }
  return null;
}
