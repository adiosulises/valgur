"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Hero as HeroData } from "@/lib/hero";
import { useLocale } from "@/contexts/LocaleContext";

// Light -> dark. Dense glyphs land on dark pixels, blanks on white ones.
const RAMP = " .,:;-~=+*#%@";
const COLS = 110; // glyphs across the full square; the glyph size is derived from this
const AUTOPLAY_MS = 6000;
const AUTOPLAY_TICK_MS = 250;
// Title font size: mobile first, then desktop (any Tailwind text-* classes).
const TITLE_SIZE = "text-2xl md:text-4xl";

// Shopify's CDN can resize on the fly; sampling a 3000px original would be wasteful.
function sampleUrl(url: string) {
    if (!/cdn\.shopify\.com/.test(url)) return url;
    return `${url}${url.includes("?") ? "&" : "?"}width=800`;
}

// Draws `src` as colored ASCII sized to the image's own proportions.
// `ok` turns false if the canvas can't be read (CORS), so the caller can show the real image.
function useAsciiArt(
    src: string,
    squareRef: React.RefObject<HTMLDivElement | null>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
    const [ok, setOk] = useState(true);
    const [aspect, setAspect] = useState(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const box = canvas?.parentElement;
        if (!canvas || !box) return;
        let img: HTMLImageElement | null = null;
        let cancelled = false;

        const draw = () => {
            if (!img || cancelled) return;
            const W = box.clientWidth;
            const H = box.clientHeight;
            if (!W || !H) return;
            const square = squareRef.current?.clientWidth || W;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            const ctx = canvas.getContext("2d")!;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cellW = square / COLS;
            ctx.font = "100px ui-monospace, Menlo, Consolas, monospace";
            const fontSize = (cellW / ctx.measureText("M").width) * 100;
            const cols = Math.max(1, Math.round(W / cellW));
            const rows = Math.max(1, Math.round(H / fontSize));

            // Sample the image down to one pixel per glyph.
            const sample = document.createElement("canvas");
            sample.width = cols;
            sample.height = rows;
            const sctx = sample.getContext("2d", { willReadFrequently: true })!;
            sctx.drawImage(img, 0, 0, cols, rows);
            let data: Uint8ClampedArray;
            try {
                data = sctx.getImageData(0, 0, cols, rows).data;
            } catch {
                setOk(false);
                return;
            }

            ctx.clearRect(0, 0, W, H);
            ctx.font = `${fontSize}px ui-monospace, Menlo, Consolas, monospace`;
            ctx.textBaseline = "top";
            const stepX = W / cols;
            const stepY = H / rows;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const i = (y * cols + x) * 4;
                    if (data[i + 3] < 24) continue;
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    const density = Math.min(1, Math.max(0, (1 - lum - 0.04) * 1.3));
                    const ch = RAMP[Math.floor(density * (RAMP.length - 1))];
                    if (ch === " ") continue;
                    ctx.fillStyle = `rgb(${r * 0.85},${g * 0.85},${b * 0.85})`;
                    ctx.fillText(ch, x * stepX, y * stepY);
                }
            }
            setOk(true);
        };

        img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            if (cancelled || !img) return;
            setAspect(Math.min(2.5, Math.max(0.4, img.naturalWidth / img.naturalHeight)));
            draw();
        };
        img.onerror = () => !cancelled && setOk(false);
        img.src = sampleUrl(src);

        const ro = new ResizeObserver(draw);
        ro.observe(box);
        if (squareRef.current) ro.observe(squareRef.current);
        return () => {
            cancelled = true;
            ro.disconnect();
        };
    }, [src, squareRef, canvasRef]);

    return { ok, aspect };
}

export function Hero({ hero }: { hero: HeroData }) {
    const { t, lang } = useLocale();
    const [selected, setSelected] = useState(0);
    const [peek, setPeek] = useState(false);
    const squareRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const text = hero.text[lang];
    const href = hero.buttonHref[lang];
    const count = hero.images.length;
    const current = hero.images[selected];
    const external = /^https?:\/\//i.test(href);
    const pad = (n: number) => String(n).padStart(2, "0");

    const { ok: asciiOk, aspect } = useAsciiArt(current?.url ?? "", squareRef, canvasRef);

    const go = (i: number) => setSelected(((i % count) + count) % count);

    // Warm the browser cache for every slide so each ASCII render starts from a cached image
    // (same crossOrigin mode as the sampler, otherwise the cached copy can't be reused).
    useEffect(() => {
        hero.images.forEach((img) => {
            const warm = new window.Image();
            warm.crossOrigin = "anonymous";
            warm.src = sampleUrl(img.url);
        });
    }, [hero.images]);

    const hoverRef = useRef<HTMLDivElement | null>(null);
    const peekRef = useRef(false);
    peekRef.current = peek;

    // Real "is the pointer over the picture" check. The browser doesn't send a mouse-enter when a slide
    // swaps in under a resting pointer, so hover events alone can't be trusted. Touch has no hover.
    const pointerOverImage = () =>
        window.matchMedia("(hover: hover)").matches && !!hoverRef.current?.matches(":hover");

    // After each slide change, re-sync the peek with where the pointer really is.
    useEffect(() => {
        const id = setTimeout(() => setPeek(pointerOverImage()), 150);
        return () => clearTimeout(id);
    }, [selected]);

    // Slideshow: counts up only while nobody is hovering the picture (or peeking on touch),
    // and starts over after any slide change, manual or automatic.
    useEffect(() => {
        if (count < 2) return;
        let elapsed = 0;
        const id = setInterval(() => {
            if (peekRef.current || pointerOverImage()) return;
            elapsed += AUTOPLAY_TICK_MS;
            if (elapsed >= AUTOPLAY_MS) {
                elapsed = 0;
                setSelected((s) => (s + 1) % count);
            }
        }, AUTOPLAY_TICK_MS);
        return () => clearInterval(id);
    }, [selected, count]);

    const showReal = peek || !asciiOk;

    // Vertical labels reading bottom -> top, file01 lowest.
    const rail = (
        <ul className="flex flex-col-reverse gap-2 shrink-0 font-mono text-xs tracking-[0.2em]">
            {hero.images.map((img, i) => (
                <li key={img.url} className="flex">
                    <button
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`${text.title} ${i + 1}/${count}`}
                        aria-current={i === selected}
                        className={`cursor-pointer [writing-mode:vertical-rl] rotate-180 transition-opacity ${
                            i === selected ? "opacity-100 underline underline-offset-4" : "opacity-40 hover:opacity-80"
                        }`}
                    >
                        file{pad(i + 1)}
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <section className="w-full grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start px-[4%] md:px-[8%] py-10 md:py-16">
            {count > 0 && (
                <div className="flex flex-col gap-4 w-full max-w-[640px]">
                    {/* Row: file names (bottom of the row), then the picture area growing to fill the rest, with the
                        picture centered in it. The counter sits under the whole row, right-aligned. */}
                    <div className="flex flex-row items-end gap-2">
                        {rail}

                        <div
                            ref={squareRef}
                            className="relative flex-1 min-w-0 aspect-square flex items-center justify-center"
                        >
                            <div
                                className="relative"
                                style={{ aspectRatio: aspect, width: aspect >= 1 ? "100%" : `${aspect * 100}%` }}
                            >
                                {/* Only the image itself is the hover target, not the area around it. */}
                                <div
                                    ref={hoverRef}
                                    data-trail-below
                                    className="absolute inset-0 cursor-crosshair"
                                    onMouseEnter={() => setPeek(true)}
                                    onMouseLeave={() => setPeek(false)}
                                    onClick={() => {
                                        if (window.matchMedia("(hover: none)").matches) setPeek((p) => !p);
                                    }}
                                >
                                    {/* The real image stays fully opaque underneath... */}
                                    <Image
                                        key={`img-${current.url}`}
                                        src={current.url}
                                        alt={current.alt}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                    {/* ...and the opaque white ASCII layer dissolves off it, so there's no dip to white. */}
                                    <div
                                        className={`absolute inset-0 bg-white transition-opacity duration-500 ${
                                            showReal ? "opacity-0" : "opacity-100"
                                        }`}
                                    >
                                        <canvas
                                            key={`ascii-${current.url}`}
                                            ref={canvasRef}
                                            aria-hidden
                                            className="w-full h-full fade-in-item"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end font-mono text-xs uppercase tracking-[0.2em]">
                        <span className="opacity-60">{pad(selected + 1)} / {pad(count)}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6 text-start min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">{t("hero.latest")}</p>

                <div className="flex flex-col gap-3">
                    <h1 className={`${TITLE_SIZE} font-bold uppercase break-words leading-[0.9]`}>{text.title}</h1>
                    {text.date && (
                        <p className="font-mono text-sm uppercase tracking-[0.2em]">{text.date}</p>
                    )}
                </div>

                {text.descriptions.length > 0 && (
                    <div className="flex flex-col gap-4 text-lg max-w-md border-t border-[#FF0084] pt-6">
                        {text.descriptions.map((d, i) => (
                            <p key={i}>{d}</p>
                        ))}
                    </div>
                )}

                {text.buttonLabel && href && (
                    <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="w-fit border bg-[#FF0084] text-white px-6 py-3 font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase hover:opacity-90 transition-opacity"
                    >
                        {text.buttonLabel} &rarr;
                    </a>
                )}
            </div>
        </section>
    );
}
