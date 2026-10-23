import type { ShopifyArticle } from "@/lib/shopify";

export type HeroLang = "ES" | "EN";

export type HeroText = {
  title: string;
  date: string;
  descriptions: string[];
  buttonLabel: string;
};

export type Hero = {
  text: Record<HeroLang, HeroText>;
  buttonHref: Record<HeroLang, string>;
  images: { url: string; alt: string }[];
};

function htmlToText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");
}

// Matches "Label: value" at the start of a line; `pattern` is regex source so
// accent/number variants ("Descripcion 1" / "Descripción 1") can share one field.
function field(text: string, pattern: string): string {
  const re = new RegExp(`(?:^|\\n)[ \\t]*(?:${pattern})[ \\t]*:[ \\t]*([^\\n]*)`, "i");
  return text.match(re)?.[1]?.trim() ?? "";
}

// "Titulo|Título" -> "Titulo[ \t]+EN|Título[ \t]+EN" (the English variant of a label).
const en = (pattern: string) =>
  pattern
    .split("|")
    .map((p) => `${p}[ \\t]+EN`)
    .join("|");

// Every "Label: value" line matching `pattern` (optionally numbered: "Imagen 2:"),
// with comma/space separated values split apart and kept only if they're links.
function allUrls(text: string, pattern: string): string[] {
  const re = new RegExp(`(?:^|\\n)[ \\t]*(?:${pattern})(?:[ \\t]*\\d+)?[ \\t]*:[ \\t]*([^\\n]*)`, "gi");
  return [...text.matchAll(re)]
    .flatMap((m) => m[1].split(/[\s,]+/))
    .filter((v) => /^https?:\/\//i.test(v));
}

function imageKey(url: string) {
  return url.split("?")[0];
}

function withProtocol(href: string) {
  if (!href || href.startsWith("/") || href.startsWith("#")) return href;
  return /^https?:\/\//i.test(href) ? href : `https://${href}`;
}

const TITLE = "Titulo|Título";
const DATE = "Fecha";
const DESC_1 = "Descripcion 1|Descripción 1";
const DESC_2 = "Descripcion 2|Descripción 2";
const BUTTON = "Boton|Botón";
const LINK = "Link|Enlace";
const IMAGE = "Imagen|Imagenes|Imágenes|Image|Images";

// Spanish fields are the base; every field also has an English twin ending in
// " EN" (e.g. "Fecha EN:"). Anything missing in English falls back to Spanish.
// Images: <img> tags in the body, then "Imagen:" lines.
export function parseHero(article: ShopifyArticle): Hero {
  const text = htmlToText(article.contentHtml);

  const es: HeroText = {
    title: field(text, TITLE) || (article.title ?? ""),
    date: field(text, DATE),
    descriptions: [field(text, DESC_1), field(text, DESC_2)].filter(Boolean),
    buttonLabel: field(text, BUTTON),
  };

  const enDescs = [field(text, en(DESC_1)), field(text, en(DESC_2))];
  const esDescs = [field(text, DESC_1), field(text, DESC_2)];
  const english: HeroText = {
    title: field(text, en(TITLE)) || es.title,
    date: field(text, en(DATE)) || es.date,
    descriptions: esDescs.map((d, i) => enDescs[i] || d).filter(Boolean),
    buttonLabel: field(text, en(BUTTON)) || es.buttonLabel,
  };

  const hrefEs = withProtocol(field(text, LINK));
  const hrefEn = withProtocol(field(text, en(LINK))) || hrefEs;

  // The post's own featured image is deliberately ignored; the gallery comes from the text.
  const urls: string[] = [];
  for (const m of (article.contentHtml ?? "").matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    urls.push(m[1]);
  }
  // "Imagen: <link>" lines (links come from Content > Files).
  urls.push(...allUrls(text, IMAGE));
  const seen = new Set<string>();
  const images = urls
    .filter((u) => !seen.has(imageKey(u)) && !!seen.add(imageKey(u)))
    .map((url) => ({ url, alt: es.title }));

  return {
    text: { ES: es, EN: english },
    buttonHref: { ES: hrefEs, EN: hrefEn },
    images,
  };
}

// Newest published article wins, so a new single replaces the old one.
export function pickLatest(articles: ShopifyArticle[]): ShopifyArticle | null {
  return (
    [...articles].sort(
      (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    )[0] ?? null
  );
}
