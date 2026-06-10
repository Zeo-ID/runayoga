import { notFound } from "next/navigation";
import { getPage, getAllStaticParams } from "../../lib/get-page";
import { PageClient } from "./client";
import { JsonLd } from "../../components/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildOpenGraph,
  buildTwitter,
  findHero,
} from "../../lib/seo";
import siteData from "../../data/site.json";
import { splitLocale, localizedHref, LOCALES, DEFAULT_LOCALE } from "../../lib/i18n";

export async function generateStaticParams() {
  return getAllStaticParams().map((puckPath) => ({ puckPath }));
}

function hreflangAlternates(basePath: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l.code] = localizedHref(l.code, basePath);
  languages["x-default"] = localizedHref(DEFAULT_LOCALE, basePath);
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath } = await params;
  const urlPath = `/${puckPath.join("/")}`;
  const { basePath } = splitLocale(urlPath);
  const data = getPage(urlPath);
  const seoTitle = data?.root?.props?.seoTitle;
  const seoDesc = data?.root?.props?.seoDescription;
  const hero = findHero(data?.content || []);
  const image = hero?.image;
  const isBlog = basePath.startsWith("/blog");

  return {
    // seoTitle trägt bereits den Markenzusatz "– Runayoga" → absolut setzen,
    // damit das Layout-Template "%s | Runayoga" ihn nicht verdoppelt.
    title: seoTitle ? { absolute: seoTitle } : (hero?.title || urlPath),
    description: seoDesc || hero?.subtitle || "",
    alternates: { canonical: urlPath, languages: hreflangAlternates(basePath) },
    openGraph: buildOpenGraph({
      title: seoTitle || hero?.title,
      description: seoDesc || hero?.subtitle,
      path: urlPath,
      image,
      type: isBlog ? "article" : "website",
    }),
    twitter: buildTwitter({
      title: seoTitle || hero?.title,
      description: seoDesc || hero?.subtitle,
      image,
    }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath } = await params;
  const urlPath = `/${puckPath.join("/")}`;
  const { basePath } = splitLocale(urlPath);
  const data = getPage(urlPath);

  if (!data) notFound();

  const hero = findHero(data?.content || []);
  const seoTitle = data?.root?.props?.seoTitle;
  const seoDesc = data?.root?.props?.seoDescription;
  const isBlog = basePath.startsWith("/blog");
  const isAngebot = basePath.startsWith("/angebote");

  const ldBlocks: object[] = [];

  if (isBlog) {
    ldBlocks.push(
      articleJsonLd({
        title: seoTitle || hero?.title || urlPath,
        description: seoDesc || hero?.subtitle || "",
        path: urlPath,
        image: hero?.image,
        datePublished: data?.root?.props?.date,
      })
    );
  }

  const breadcrumbs: { name: string; path: string }[] = [
    { name: siteData.name, path: "/" },
  ];
  if (isBlog) {
    breadcrumbs.push({ name: "Blog", path: "/blog" });
  } else if (isAngebot) {
    breadcrumbs.push({ name: "Angebote", path: "/angebote" });
  }
  breadcrumbs.push({
    name: seoTitle || hero?.title || puckPath[puckPath.length - 1],
    path: urlPath,
  });
  ldBlocks.push(breadcrumbJsonLd(breadcrumbs));

  return (
    <>
      <JsonLd data={ldBlocks} />
      <PageClient data={data} />
    </>
  );
}
