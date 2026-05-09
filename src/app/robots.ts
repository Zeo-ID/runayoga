import type { MetadataRoute } from "next";
import siteData from "../data/site.json";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = (siteData as { url?: string }).url?.replace(/\/$/, "") || "";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
