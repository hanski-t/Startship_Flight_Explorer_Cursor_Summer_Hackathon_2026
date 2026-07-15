import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "");

if (!siteUrl) {
  console.warn(
    "[seo] VITE_SITE_URL not set — sitemap.xml and robots.txt keep relative URLs. Set before deploy for full SEO.",
  );
  process.exit(0);
}

const root = resolve(import.meta.dirname, "..");
const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve(root, "dist/sitemap.xml"), sitemap);
writeFileSync(resolve(root, "dist/robots.txt"), robots);

// Also update public copies for dev preview consistency
writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
writeFileSync(resolve(root, "public/robots.txt"), robots);

console.log(`[seo] Wrote sitemap and robots.txt for ${siteUrl}`);
