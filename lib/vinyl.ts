import { ShopifyArticle, ShopifyProduct } from "./shopify";

export type Vinyl = {
  handle: string;
  title: string;
  buenDiaLink: string;
  image: string | null;
  images: string[];
  price: string | null;
  available: boolean;
};

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

function firstImage(html: string | null | undefined): string | null {
  return (html ?? "").match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

function buenDiaLink(html: string | null | undefined): string {
  const text = htmlToText(html);
  return text.match(/Buen Dia Records:[ \t]*([^\n]*)/i)?.[1]?.trim() ?? "";
}

export function articlesToVinyls(articles: ShopifyArticle[]): Vinyl[] {
  return articles
    .map((a): Vinyl | null => {
      const link = buenDiaLink(a.contentHtml);
      if (!link || !a.handle) return null;
      return {
        handle: a.handle,
        title: `Vinil ${a.title ?? ""}`.trim(),
        buenDiaLink: link,
        image: firstImage(a.contentHtml) ?? a.image?.url ?? null,
        images: [],
        price: null,
        available: false,
      };
    })
    .filter((v): v is Vinyl => v !== null);
}

async function fetchBuenDia(url: string) {
  const jsonUrl = url.split("?")[0].replace(/\/$/, "") + ".json";
  try {
    const res = await fetch(jsonUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const product = data?.product;
    if (!product) return null;

    const prices = (product.variants ?? [])
      .map((v: { price: string }) => parseFloat(v.price))
      .filter((n: number) => !Number.isNaN(n));

    return {
      images: (product.images ?? []).map((i: { src: string }) => i.src as string),
      price: prices.length ? String(Math.min(...prices)) : null,
      available: (product.variants ?? []).some((v: { available: boolean }) => v.available),
    };
  } catch {
    return null;
  }
}

export async function getVinyls(articles: ShopifyArticle[]): Promise<Vinyl[]> {
  const base = articlesToVinyls(articles);
  return Promise.all(
    base.map(async (v) => {
      const data = await fetchBuenDia(v.buenDiaLink);
      if (!data) return v;
      return {
        ...v,
        images: data.images.length ? data.images : v.image ? [v.image] : [],
        image: data.images[0] ?? v.image,
        price: data.price,
        available: data.available,
      };
    })
  );
}
