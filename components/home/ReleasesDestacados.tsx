"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopifyArticle } from "@/lib/shopify";
import { parseReleases } from "@/lib/releases";
import { useEffect, useState } from "react";
import leftNav  from "@/lib/vectors/releases_leftnav.svg";
import rightNav  from "@/lib/vectors/releases_rightnav.svg";
import { useLocale } from "@/contexts/LocaleContext";

// Fixed height so the layout doesn't jump when flipping between albums
// (the tracklist scrolls inside the player instead).
const PLAYER_HEIGHT = 340;

function PlayerSkeleton({ hidden }: { hidden: boolean }) {
    const block = "bg-[#FF0084]/10 rounded-sm";
    return (
        <div
            aria-hidden
            className={`absolute inset-0 flex flex-col gap-4 p-4 border border-[#FF0084]/20 bg-white animate-pulse transition-opacity duration-300 ${
                hidden ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 w-1/2">
                    <div className={`${block} h-4 w-2/3`} />
                    <div className={`${block} h-3 w-1/3`} />
                </div>
                <div className={`${block} h-4 w-24`} />
            </div>
            <div className="flex items-center gap-3">
                <div className={`${block} h-12 w-12 shrink-0`} />
                <div className={`${block} h-4 flex-1`} />
                <div className={`${block} h-4 w-10 shrink-0`} />
            </div>
            <div className="flex flex-col gap-4 pt-2 border-t border-[#FF0084]/20">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
                        <div className={`${block} h-3`} style={{ width: `${70 - (i % 3) * 12}%` }} />
                        <div className={`${block} h-3 w-10 shrink-0`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Keyed by album id at the call site so the loaded state resets per album.
// The iframe mounts after hydration so its load event can't fire before we're listening.
function BandcampPlayer({ embedId, title }: { embedId: string; title: string }) {
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="relative w-full" style={{ height: PLAYER_HEIGHT }}>
            <PlayerSkeleton hidden={loaded} />
            {mounted && (
                <iframe
                    title={title}
                    src={`https://bandcamp.com/EmbeddedPlayer/album=${embedId}/size=large/bgcol=ffffff/linkcol=ff0084/tracklist=true/artwork=none/transparent=true/`}
                    onLoad={() => setLoaded(true)}
                    className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    seamless
                />
            )}
        </div>
    );
}

export function ReleasesDestacados({
    releases,
    embedIds = {},
}: {
    releases: ShopifyArticle[];
    embedIds?: Record<string, string | null>;
}){

    const { t } = useLocale();
    const [index, setIndex] = useState(0);
    const parsedReleases = parseReleases(releases);
    const release = parsedReleases[index];
    const image = release.images.edges[0]?.node;
    const embedId = embedIds[release.handle];
    const links = Object.entries(release.links).filter(([, url]) => url);
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const goPrev = () => setIndex((i) => (i - 1 + releases.length) % releases.length);
    const goNext = () => setIndex((i) => (i + 1) % releases.length);

    return(
        <>
            <div className="w-full flex flex-col px-[4%] md:px-[8%] py-6 gap-4">
                <h1 className="text-2xl">{t("music.heading")}</h1>
                <div className="grid gap-8 md:grid-cols-2 md:items-start">
                    <div className="relative w-full aspect-square">
                        <Image
                            src={image?.url ?? ""}
                            alt={image?.altText ?? release.title ?? ""}
                            fill
                            className="object-contain shadow-2xl"
                        />
                    </div>

                    <div className="flex flex-col gap-4 text-start min-w-0">
                        <h2 className="text-2xl font-bold break-words">{release.title} - {release.year}</h2>

                        {embedId && (
                            <BandcampPlayer key={embedId} embedId={embedId} title={t("music.playerTitle")} />
                        )}

                        {links.length > 0 && (
                            <div className="flex flex-col gap-2 min-h-[6.5rem]">
                                <span className="uppercase text-sm opacity-60">{t("music.listenOn")}</span>
                                <ul className="flex flex-wrap gap-2">
                                    {links.map(([platform, url]) => (
                                        <li key={platform}>
                                            <Link
                                                href={url as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 px-3 inline-flex items-center border border-[#FF0084] text-[#FF0084] uppercase text-sm transition-colors hover:bg-[#FF0084] hover:text-white"
                                            >
                                                {capitalize(platform)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {releases.length > 1 && (
                            <div className="flex items-center justify-end gap-4 text-end">
                                <button type="button" onClick={goPrev} aria-label={t("music.prevRelease")}>
                                    <Image src={leftNav} alt={t("music.leftArrowAlt")} width={20} height={20} />
                                </button>
                                <span className="font-bold text-[20px] leading-none">
                                    {index + 1}/{releases.length}
                                </span>
                                <button type="button" onClick={goNext} aria-label={t("music.nextRelease")}>
                                    <Image src={rightNav} alt={t("music.rightArrowAlt")} width={20} height={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
