import { useEffect } from "react";
import type { Flight } from "../types/flight";
import { SITE, absoluteUrl, siteUrl } from "../config/site";

interface SeoProps {
  flight?: Flight | null;
}

export function Seo({ flight }: SeoProps) {
  useEffect(() => {
    const baseTitle = SITE.title;
    document.title = flight
      ? `${flight.id} — ${SITE.name}`
      : baseTitle;

    setMeta("description", flight ? flightSummary(flight) : SITE.description);

    const ogTitle = flight ? `${flight.id} | ${SITE.name}` : SITE.name;
    setMetaProperty("og:title", ogTitle);
    setMetaProperty("og:description", flight ? flightSummary(flight) : SITE.description);

    const base = siteUrl();
    if (base) {
      setMetaProperty("og:url", absoluteUrl(flight ? `/?flight=${flight.id}` : "/"));
      setMetaProperty("og:image", absoluteUrl("/og-image.svg"));
      setMetaName("twitter:image", absoluteUrl("/og-image.svg"));
    }

    const canonical = base
      ? absoluteUrl(flight ? `/?flight=${flight.id}` : "/")
      : "";
    setCanonical(canonical || null);
  }, [flight]);

  return null;
}

function flightSummary(flight: Flight): string {
  const status = flight.upcoming ? "Scheduled" : flight.outcome;
  return `${flight.id} (${flight.vehicle}, ${status}): ${flight.summary}`;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaName(name: string, content: string) {
  setMeta(name, content);
}

function setCanonical(href: string | null) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}
