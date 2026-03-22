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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
