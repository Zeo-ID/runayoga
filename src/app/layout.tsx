import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";
import { ScrollReveal } from "../components/layout/ScrollReveal";
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
    <html lang="de" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var m=location.pathname.match(/^\\/(en|pl|tr|ru|ar)(\\/|$)/);var l=m?m[1]:'de';var e=document.documentElement;e.lang=l;e.dir=(l==='ar')?'rtl':'ltr';})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollReveal />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
