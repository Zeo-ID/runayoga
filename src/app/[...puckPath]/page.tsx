import { notFound } from "next/navigation";
import { getPage, getAllPaths } from "../../lib/get-page";
import { PageClient } from "./client";

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
  return {
    title: seoTitle || urlPath,
    description: seoDesc || "",
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

  return <PageClient data={data} />;
}
