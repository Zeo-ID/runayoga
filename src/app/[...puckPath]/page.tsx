import { notFound } from "next/navigation";
import { getPage, getAllPaths } from "../../lib/get-page";
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

export async function generateStaticParams() {
  const paths = getAllPaths().filter((p) => p !== "/");
  return paths.map((p) => ({
    puckPath: p.replace(/^\//, "").split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath } = await params;
  const urlPath = `/${puckPath.join("/")}`;
  const data = getPage(urlPath);
  const seoTitle = data?.root?.props?.seoTitle;
  const seoDesc = data?.root?.props?.seoDescription;
  const hero = findHero(data?.content || []);
  const image = hero?.image;
  const isBlog = puckPath[0] === "blog";

  return {
    title: seoTitle || hero?.title || urlPath,
    description: seoDesc || hero?.subtitle || "",
    alternates: { canonical: urlPath },
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
  const data = getPage(urlPath);

  if (!data) notFound();

  const hero = findHero(data?.content || []);
  const seoTitle = data?.root?.props?.seoTitle;
  const seoDesc = data?.root?.props?.seoDescription;
  const isBlog = puckPath[0] === "blog";
  const isAngebot = puckPath[0] === "angebote";

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
