"use client";

import { useState } from "react";
import Image from "next/image";
import { ShopifyProduct } from "@/lib/shopify";

export function SlugDisplay({product} : {product : ShopifyProduct}){
    const [talla, setTalla] = useState("");
    const [current, setCurrent] = useState(0);

    const formatPrice = (price: { amount: string; currencyCode: string }) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: price.currencyCode,
            trailingZeroDisplay: "stripIfInteger",
        }).format(parseFloat(price.amount));

    const sizes = product.variants.edges
        .map((e) => e.node.selectedOptions[0])
        .filter((o) => o && o.value !== "Default Title")
        .map((o) => o.value);

    const selectedVariant = product.variants.edges.find(
    (e) => e.node.selectedOptions[0]?.value === talla
    )?.node;
    const displayPrice = selectedVariant?.price ?? product.priceRange.minVariantPrice;
    const optionName = product.variants.edges[0]?.node.selectedOptions[0]?.name ?? "";

    return(
        <>
            <div className="flex flex-col md:grid md:grid-cols-2 px-[2%] md:px-[8%]">
                {/* Columna imagenes */}
                <div className="flex flex-col gap-4">
                    {/* Desktop: stack */}
                    <div className="hidden md:flex flex-col gap-4">
                        {product.images.edges.map((edge, i) => (
                            <div key={edge.node.url + i} className="relative w-full aspect-square">
                                <Image
                                    src={edge.node.url}
                                    alt={edge.node.altText || product.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Mobile: swipe carousel */}
                    <div className="md:hidden relative">
                        <div
                            onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
                            className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {product.images.edges.map((edge, i) => (
                                <div key={edge.node.url + i} className="relative w-full shrink-0 snap-center aspect-square">
                                    <Image
                                        src={edge.node.url}
                                        alt={edge.node.altText || product.title}
                                        fill
                                        sizes="100vw"
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Mobile: image counter */}
                        {product.images.edges.length > 0 && (
                            <div className="absolute bottom-2 right-2 font-['Times_New_Roman'] font-bold text-[20px] leading-none tracking-normal">
                                {current + 1}/{product.images.edges.length}
                            </div>
                        )}
                    </div>
                    {/* Mobile: dashed divider */}
                    <div
                        className="md:hidden h-px w-full"
                        style={{ backgroundImage: "repeating-linear-gradient(to right, currentColor 0 8px, transparent 8px 16px)" }}
                    />
                </div>
                {/* Columna selectores */}
                <div className="flex flex-col gap-4 md:aspect-square md:justify-center md:sticky md:top-0 md:self-start md:px-[8%]">
                    <h1 className="text-l font-bold uppercase">{product.title}</h1>
                    <p>{formatPrice(displayPrice)} MXN</p>
                    {product.description && <p className="italic uppercase opacity-60">{product.description}</p>}
                    {sizes.length > 0 && (
                        <select
                            value={talla}
                            onChange={(e) => setTalla(e.target.value)}
                            className="border-b w-full px-0 py-1 uppercase cursor-pointer text-left"
                            aria-label="Talla"
                        >
                            <option value="" disabled hidden>
                                SELECCIONAR {optionName.toUpperCase()}
                            </option>
                            {sizes.map((t) => (
                                <option key={t} value={t} className="uppercase">
                                    {t}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        type="button"
                        className="border bg-[#FF0084] text-white w-full px-4 py-2 font-['Times_New_Roman'] font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase"
                    >
                        Añadir al carro
                    </button>
                </div>
            </div>
        </>
    );
}