import { SITE, absoluteUrl } from "../config/site";

export function StructuredData() {
  const base = absoluteUrl("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE.name,
        description: SITE.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        ...(base && { url: base }),
      },
      {
        "@type": "WebPage",
        name: SITE.title,
        description: SITE.description,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: SITE.name, ...(base && { url: base }) },
        about: {
          "@type": "Thing",
          name: "SpaceX Starship integrated flight test program",
          description:
            "Integrated flight tests (IFT) of the Starship launch system including Super Heavy booster and Starship upper stage.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
