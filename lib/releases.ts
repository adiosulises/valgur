import type { ShopifyArticle } from "@/lib/shopify";

export type Release = {
  images: { edges: { node: { url: string; altText: string } }[] };
  title: string;
  year: string;
  handle: string;
  buenDiaLink: string | null;
  links: {
    bandcamp?: string | null;
    spotify?: string | null;
    apple?: string | null;
    youtube?: string | null;
    deezer?: string | null;
    tidal?: string | null;
  };
};

function htmlToText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&"); // so URL query params like ?a=1&b=2 survive
}

export function parseReleases(articles: ShopifyArticle[]): Release[] {
  const field = (html: string, label: string) =>
    html.match(new RegExp(`${label}:[ \\t]*([^\\n]*)`))?.[1]?.trim() ?? "";

  return articles.map((article) => {
    const html = htmlToText(article.contentHtml);
    return {
      images: {
        edges: article.image
          ? [{ node: { url: article.image.url, altText: article.image.altText ?? "" } }]
          : [],
      },
      title: field(html, "Titulo") || (article.title ?? ""),
      year: field(html, "Fecha"),
      handle: article.handle ?? "",
      buenDiaLink: field(html, "Buen Dia Records") || null,
      links: {
        spotify: field(html, "Spotify") || null,
        bandcamp: field(html, "Bandcamp") || null,
        apple: field(html, "Apple") || null,
        youtube: field(html, "Youtube") || null,
        deezer: field(html, "Deezer") || null,
        tidal: field(html, "Tidal") || null,
      },
    };
  });
}
