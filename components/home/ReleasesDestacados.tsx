"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopifyArticle } from "@/lib/shopify";
import { useState } from "react";
import leftNav  from "@/lib/vectors/releases_leftnav.svg";
import rightNav  from "@/lib/vectors/releases_rightnav.svg";
import { useLocale } from "@/contexts/LocaleContext";

type Release = {
images: {edges: {node: {url: string; altText: string;};}[];};
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
}
}

function htmlToText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");   // so URL query params like ?a=1&b=2 survive
}

function parseReleases(articles: ShopifyArticle[]): Release[] {
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

export function ReleasesDestacados({ releases }: { releases: ShopifyArticle [] }){

    const { t } = useLocale();
    const [index, setIndex] = useState(0);
    const parsedReleases = parseReleases(releases);
    const release = parsedReleases[index];
    const image = release.images.edges[0]?.node;
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    

    const goPrev = () => setIndex((i) => (i - 1 + releases.length) % releases.length);
    const goNext = () => setIndex((i) => (i + 1) % releases.length);

    return(
        <>
            <div className="w-full flex flex-col px-[4%] md:px-[8%] py-6 gap-4">
                <h1 className="text-2xl">{t("music.heading")}</h1>
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                    <div className="relative w-full aspect-square md:w-172 md:min-w-0 md:shrink">
                    <Image
                        src={image?.url ?? ""}
                        alt={image?.altText ?? release.title ?? ""}
                        fill
                        className="object-contain"
                    />
                    </div>
                    <div className="flex flex-col gap-4 text-start min-h-80 md:w-80 md:shrink-0 md:self-stretch">
                        <h1 className="text-2xl font-bold break-words">{release.title} - {release.year}</h1>
                        <ul className="flex flex-col">
                            {Object.entries(release.links)
                                .filter(([, url]) => url !== null)
                                .map(([platform, url]) => (
                                    <li key={platform}>
                                        <Link
                                            href={url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0000EE] text-xl underline">
                                            {capitalize(platform)}
                                        </Link>
                                    </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-end gap-4 mt-auto w-full text-end">
                            <button type="button" onClick={goPrev} aria-label={t("music.prevRelease")}>
                                <Image src={leftNav} alt={t("music.leftArrowAlt")} width={20} height={20} />
                            </button>
                            <button type="button" onClick={goNext} aria-label={t("music.nextRelease")}>
                                <Image src={rightNav} alt={t("music.rightArrowAlt")} width={20} height={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}