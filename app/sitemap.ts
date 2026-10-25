import type { MetadataRoute } from "next";
import { getProducts, getArticlesByBlogHandle } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { SITE_URL } from "@/lib/site";

// Shopify is the source of truth for the catalog; if it's unreachable the static pages still get listed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tienda`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/shows`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/bio`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const { body } = await getProducts();
    const articles = await getArticlesByBlogHandle("releases");
    const vinyls = await getVinyls(articles);
    const handles = [
      ...body.data.products.edges.map((e) => e.node.handle),
      ...vinyls.map((v) => v.handle),
    ];
    for (const handle of handles) {
      pages.push({ url: `${SITE_URL}/tienda/${handle}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
    }
  } catch {}

  return pages;
}
