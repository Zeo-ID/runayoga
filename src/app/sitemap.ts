import type { MetadataRoute } from "next";
import { getAllPaths } from "../lib/get-page";
import siteData from "../data/site.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (siteData as { url?: string }).url?.replace(/\/$/, "") || "";
  const now = new Date();

  return getAllPaths().map((p) => ({
    url: `${base}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : p.startsWith("/blog/") ? 0.6 : 0.7,
  }));
}
