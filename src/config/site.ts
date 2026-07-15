/** Site-wide SEO and sharing metadata. Set VITE_SITE_URL when deploying. */
export const SITE = {
  name: "Starship Flight Explorer",
  title: "Starship Flight Explorer — IFT Flight Test Timeline",
  description:
    "Explore every SpaceX Starship integrated flight test from IFT-1 to IFT-13. Interactive timeline with mission maps, stage-by-stage outcomes, and Block 1/2/3 vehicle progression.",
  keywords: [
    "Starship",
    "SpaceX",
    "IFT",
    "integrated flight test",
    "Super Heavy",
    "flight test timeline",
    "Starbase",
    "booster catch",
    "Starship splashdown",
    "Block 3",
  ],
  locale: "en_US",
  themeColor: "#0a0f1e",
  twitterHandle: "", // e.g. "@yourhandle" — optional
} as const;

export function siteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL as string | undefined;
  return url?.replace(/\/$/, "") ?? "";
}

export function absoluteUrl(path = ""): string {
  const base = siteUrl();
  if (!base) return path || "/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
