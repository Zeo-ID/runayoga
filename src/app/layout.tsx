import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";
import siteData from "../data/site.json";

export const metadata: Metadata = {
  title: {
    default: siteData.name,
    template: `%s | ${siteData.name}`,
  },
  description: siteData.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-body">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
