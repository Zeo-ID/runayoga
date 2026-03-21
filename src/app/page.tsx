import { getPage } from "../lib/get-page";
import { PageClient } from "./[...puckPath]/client";

export async function generateMetadata() {
  const data = getPage("/");
  const seoTitle = data?.root?.props?.seoTitle;
  const seoDesc = data?.root?.props?.seoDescription;
  return {
    title: seoTitle || "Startseite",
    description: seoDesc || "",
  };
}

export default function HomePage() {
  const data = getPage("/");

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Willkommen</h1>
          <p className="text-gray-500">
            Öffne <a href="/admin" className="text-blue-600 underline">/admin</a> um die Seite zu bearbeiten.
          </p>
        </div>
      </div>
    );
  }

  return <PageClient data={data} />;
}
