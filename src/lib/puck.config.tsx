import type { Config } from "@puckeditor/core";
import { Hero } from "../components/puck/Hero";
import { RichText } from "../components/puck/RichText";
import { Cards } from "../components/puck/Cards";
import { CTA } from "../components/puck/CTA";
import { TextImage } from "../components/puck/TextImage";
import { Testimonials } from "../components/puck/Testimonials";
import { FAQ } from "../components/puck/FAQ";
import { Gallery } from "../components/puck/Gallery";
import { Pricing } from "../components/puck/Pricing";
import { Contact } from "../components/puck/Contact";
import { Divider } from "../components/puck/Divider";
import { Quote } from "../components/puck/Quote";
import { Video } from "../components/puck/Video";

type Props = {
  Hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    secondButtonText: string;
    secondButtonLink: string;
    image: string;
    imageAlt: string;
    layout: "left" | "right" | "center";
  };
  RichText: {
    content: string;
  };
  Cards: {
    title: string;
    columns: number;
    cards: { title: string; text: string; image: string; link: string }[];
  };
  CTA: {
    title: string;
    text: string;
    buttonText: string;
    buttonLink: string;
    variant: "primary" | "accent" | "dark";
  };
  TextImage: {
    title: string;
    text: string;
    image: string;
    imageAlt: string;
    imagePosition: "left" | "right";
  };
  Testimonials: {
    title: string;
    items: { text: string; name: string; rating: number }[];
  };
  FAQ: {
    title: string;
    items: { question: string; answer: string }[];
  };
  Gallery: {
    title: string;
    columns: number;
    images: { src: string; alt: string; caption: string }[];
  };
  Pricing: {
    title: string;
    packages: {
      name: string;
      price: string;
      features: string[];
      buttonText: string;
      buttonLink: string;
      highlighted: boolean;
    }[];
  };
  Contact: {
    title: string;
    text: string;
    showMap: boolean;
    mapEmbed: string;
  };
  Divider: {
    style: "line" | "space" | "decorative";
    height: number;
  };
  Quote: {
    text: string;
    source: string;
    variant: "simple" | "decorative";
  };
  Video: {
    url: string;
    title: string;
  };
};

const config: Config<Props> = {
  categories: {
    inhalt: {
      title: "Inhalt",
      components: ["Hero", "RichText", "TextImage", "Cards", "Quote"],
    },
    interaktiv: {
      title: "Interaktiv",
      components: ["CTA", "FAQ", "Testimonials", "Contact"],
    },
    medien: {
      title: "Medien",
      components: ["Gallery", "Video"],
    },
    geschaeft: {
      title: "Geschäft",
      components: ["Pricing"],
    },
    layout: {
      title: "Layout",
      components: ["Divider"],
    },
  },
  components: {
    Hero: {
      label: "Hero-Bereich",
      fields: {
        title: { type: "text", label: "Überschrift" },
        subtitle: { type: "textarea", label: "Untertitel" },
        buttonText: { type: "text", label: "Button-Text" },
        buttonLink: { type: "text", label: "Button-Link" },
        secondButtonText: { type: "text", label: "2. Button (optional)" },
        secondButtonLink: { type: "text", label: "2. Button-Link" },
        image: { type: "text", label: "Bild-URL" },
        imageAlt: { type: "text", label: "Bild-Beschreibung" },
        layout: {
          type: "radio",
          label: "Layout",
          options: [
            { label: "Bild rechts", value: "right" },
            { label: "Bild links", value: "left" },
            { label: "Zentriert", value: "center" },
          ],
        },
      },
      defaultProps: {
        title: "Willkommen",
        subtitle: "Beschreibung hier eingeben",
        buttonText: "Mehr erfahren",
        buttonLink: "/angebote",
        secondButtonText: "",
        secondButtonLink: "",
        image: "/images/hero.jpg",
        imageAlt: "",
        layout: "right",
      },
      render: Hero,
    },

    RichText: {
      label: "Text-Block",
      fields: {
        content: { type: "textarea", label: "Inhalt (HTML)" },
      },
      defaultProps: {
        content: "<h2>Überschrift</h2><p>Ihr Text hier...</p>",
      },
      render: RichText,
    },

    Cards: {
      label: "Karten-Grid",
      fields: {
        title: { type: "text", label: "Überschrift" },
        columns: {
          type: "radio",
          label: "Spalten",
          options: [
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
          ],
        },
        cards: {
          type: "array",
          label: "Karten",
          arrayFields: {
            title: { type: "text", label: "Titel" },
            text: { type: "textarea", label: "Text" },
            image: { type: "text", label: "Bild-URL" },
            link: { type: "text", label: "Link" },
          },
        },
      },
      defaultProps: {
        title: "Unsere Angebote",
        columns: 3,
        cards: [
          { title: "Angebot 1", text: "Beschreibung", image: "", link: "" },
          { title: "Angebot 2", text: "Beschreibung", image: "", link: "" },
          { title: "Angebot 3", text: "Beschreibung", image: "", link: "" },
        ],
      },
      render: Cards,
    },

    CTA: {
      label: "Call-to-Action",
      fields: {
        title: { type: "text", label: "Überschrift" },
        text: { type: "textarea", label: "Text" },
        buttonText: { type: "text", label: "Button-Text" },
        buttonLink: { type: "text", label: "Button-Link" },
        variant: {
          type: "radio",
          label: "Stil",
          options: [
            { label: "Primär", value: "primary" },
            { label: "Akzent", value: "accent" },
            { label: "Dunkel", value: "dark" },
          ],
        },
      },
      defaultProps: {
        title: "Bereit loszulegen?",
        text: "Kontaktieren Sie uns noch heute.",
        buttonText: "Jetzt anfragen",
        buttonLink: "/kontakt",
        variant: "primary",
      },
      render: CTA,
    },

    TextImage: {
      label: "Text + Bild",
      fields: {
        title: { type: "text", label: "Überschrift" },
        text: { type: "textarea", label: "Text" },
        image: { type: "text", label: "Bild-URL" },
        imageAlt: { type: "text", label: "Bild-Beschreibung" },
        imagePosition: {
          type: "radio",
          label: "Bild-Position",
          options: [
            { label: "Links", value: "left" },
            { label: "Rechts", value: "right" },
          ],
        },
      },
      defaultProps: {
        title: "Über uns",
        text: "Erzählen Sie Ihre Geschichte...",
        image: "/images/about.jpg",
        imageAlt: "",
        imagePosition: "right",
      },
      render: TextImage,
    },

    Testimonials: {
      label: "Kundenstimmen",
      fields: {
        title: { type: "text", label: "Überschrift" },
        items: {
          type: "array",
          label: "Bewertungen",
          arrayFields: {
            text: { type: "textarea", label: "Text" },
            name: { type: "text", label: "Name" },
            rating: {
              type: "number",
              label: "Sterne (1-5)",
              min: 1,
              max: 5,
            },
          },
        },
      },
      defaultProps: {
        title: "Was unsere Kunden sagen",
        items: [
          { text: "Toller Service!", name: "Anna M.", rating: 5 },
          { text: "Sehr empfehlenswert.", name: "Thomas K.", rating: 5 },
        ],
      },
      render: Testimonials,
    },

    FAQ: {
      label: "FAQ",
      fields: {
        title: { type: "text", label: "Überschrift" },
        items: {
          type: "array",
          label: "Fragen",
          arrayFields: {
            question: { type: "text", label: "Frage" },
            answer: { type: "textarea", label: "Antwort" },
          },
        },
      },
      defaultProps: {
        title: "Häufige Fragen",
        items: [
          { question: "Wie kann ich einen Termin buchen?", answer: "Kontaktieren Sie uns per Telefon oder E-Mail." },
        ],
      },
      render: FAQ,
    },

    Gallery: {
      label: "Galerie",
      fields: {
        title: { type: "text", label: "Überschrift" },
        columns: {
          type: "radio",
          label: "Spalten",
          options: [
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
          ],
        },
        images: {
          type: "array",
          label: "Bilder",
          arrayFields: {
            src: { type: "text", label: "Bild-URL" },
            alt: { type: "text", label: "Beschreibung" },
            caption: { type: "text", label: "Bildunterschrift" },
          },
        },
      },
      defaultProps: {
        title: "Galerie",
        columns: 3,
        images: [],
      },
      render: Gallery,
    },

    Pricing: {
      label: "Preise",
      fields: {
        title: { type: "text", label: "Überschrift" },
        packages: {
          type: "array",
          label: "Pakete",
          arrayFields: {
            name: { type: "text", label: "Name" },
            price: { type: "text", label: "Preis" },
            features: {
              type: "array",
              label: "Features",
              arrayFields: {
                value: { type: "text", label: "Feature" },
              },
            } as any,
            buttonText: { type: "text", label: "Button-Text" },
            buttonLink: { type: "text", label: "Button-Link" },
            highlighted: {
              type: "radio",
              label: "Hervorgehoben",
              options: [
                { label: "Ja", value: true },
                { label: "Nein", value: false },
              ],
            },
          },
        },
      },
      defaultProps: {
        title: "Unsere Preise",
        packages: [
          {
            name: "Basis",
            price: "29€/Monat",
            features: ["Feature 1", "Feature 2"],
            buttonText: "Auswählen",
            buttonLink: "/kontakt",
            highlighted: false,
          },
          {
            name: "Premium",
            price: "59€/Monat",
            features: ["Feature 1", "Feature 2", "Feature 3"],
            buttonText: "Auswählen",
            buttonLink: "/kontakt",
            highlighted: true,
          },
        ],
      },
      render: Pricing,
    },

    Contact: {
      label: "Kontakt",
      fields: {
        title: { type: "text", label: "Überschrift" },
        text: { type: "textarea", label: "Text" },
        showMap: {
          type: "radio",
          label: "Karte anzeigen",
          options: [
            { label: "Ja", value: true },
            { label: "Nein", value: false },
          ],
        },
        mapEmbed: { type: "text", label: "Google Maps Embed-URL" },
      },
      defaultProps: {
        title: "Kontakt",
        text: "Wir freuen uns auf Ihre Nachricht.",
        showMap: false,
        mapEmbed: "",
      },
      render: Contact,
    },

    Divider: {
      label: "Trenner",
      fields: {
        style: {
          type: "radio",
          label: "Stil",
          options: [
            { label: "Linie", value: "line" },
            { label: "Abstand", value: "space" },
            { label: "Dekorativ", value: "decorative" },
          ],
        },
        height: { type: "number", label: "Höhe (px)", min: 8, max: 120 },
      },
      defaultProps: {
        style: "space",
        height: 48,
      },
      render: Divider,
    },

    Quote: {
      label: "Zitat",
      fields: {
        text: { type: "textarea", label: "Zitat-Text" },
        source: { type: "text", label: "Quelle" },
        variant: {
          type: "radio",
          label: "Stil",
          options: [
            { label: "Schlicht", value: "simple" },
            { label: "Dekorativ", value: "decorative" },
          ],
        },
      },
      defaultProps: {
        text: "Ein inspirierendes Zitat.",
        source: "",
        variant: "simple",
      },
      render: Quote,
    },

    Video: {
      label: "Video",
      fields: {
        url: { type: "text", label: "YouTube / Vimeo URL" },
        title: { type: "text", label: "Titel" },
      },
      defaultProps: {
        url: "",
        title: "Video",
      },
      render: Video,
    },
  },

  root: {
    fields: {
      seoTitle: { type: "text", label: "SEO Titel (50-60 Zeichen)" },
      seoDescription: {
        type: "textarea",
        label: "Meta-Beschreibung (150-160 Zeichen)",
      },
    },
    defaultProps: {
      seoTitle: "",
      seoDescription: "",
    },
  },
};

export default config;
