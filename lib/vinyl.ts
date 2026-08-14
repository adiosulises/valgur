import { ShopifyArticle, ShopifyProduct } from "./shopify";

export type Vinyl = {
  handle: string;
  title: string; // "Vinil <article title>"
  image: string | null;
  buenDiaLink: string;
};

// Unified item for the store grids: a Shopify product (merch) or a vinyl (disco)
export type CardItem =
  | { kind: "product"; product: ShopifyProduct }
  | { kind: "vinyl"; vinyl: Vinyl };

function htmlToText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");
}

// First <img> src straight from the raw HTML (before tags are stripped)
function firstImage(html: string | null | undefined): string | null {
  return (html ?? "").match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

function buenDiaLink(html: string | null | undefined): string {
  const text = htmlToText(html);
  return text.match(/Buen Dia Records:[ \t]*([^\n]*)/i)?.[1]?.trim() ?? "";
}

// A "Releases" article is a vinyl only if it declares a Buen Dia Records link.
export function articlesToVinyls(articles: ShopifyArticle[]): Vinyl[] {
  return articles
    .map((a): Vinyl | null => {
      const link = buenDiaLink(a.contentHtml);
      if (!link || !a.handle) return null;
      return {
        handle: a.handle,
        title: `Vinil ${a.title ?? ""}`.trim(),
        image: firstImage(a.contentHtml) ?? a.image?.url ?? null,
        buenDiaLink: link,
      };
    })
    .filter((v): v is Vinyl => v !== null);
}
