import type { Metadata } from "next";
import { LinksHub } from "../../components/LinksHub";

export const metadata: Metadata = {
  title: "Alle Wege zu mir – Runayoga",
  description: "WhatsApp, Instagram, Anfahrt, BVG-Route, Kurse & mehr – alle Kontaktwege zu Runayoga in Berlin-Pankow auf einen Blick.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/links" },
};

export default function LinksPage() {
  return <LinksHub />;
}
