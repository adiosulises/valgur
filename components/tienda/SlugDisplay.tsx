"use client";

import { useState } from "react";
import Image from "next/image";
import { ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import { Dropdown } from "../ui/dropdown";

export function SlugDisplay({product} : {product : ShopifyProduct}){
    const { addItem } = useCart();
    const [current, setCurrent] = useState(0);

    const variants = product.variants.edges.map((e) => e.node);

    // Option names in order (e.g. ["Color","Talla"]); ignore Shopify's default "Title"
    const optionNames = (variants[0]?.selectedOptions ?? [])
        .map((o) => o.name)
        .filter((n) => n !== "Title");

    const [opt1, setOpt1] = useState("");
    const [opt2, setOpt2] = useState("");

    const formatPrice = (price: { amount: string; currencyCode: string }) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: price.currencyCode,
            trailingZeroDisplay: "stripIfInteger",
        }).format(parseFloat(price.amount));

    // First-level values (distinct)
    const values1 = [
        ...new Set(
            variants
                .map((v) => v.selectedOptions[0]?.value)
                .filter((v): v is string => !!v && v !== "Default Title")
        ),
    ];

    // Second-level values for the chosen first option, only if available
    const values2 =
        optionNames.length > 1
            ? [
                  ...new Set(
                      variants
                          .filter((v) => v.selectedOptions[0]?.value === opt1 && v.availableForSale)
                          .map((v) => v.selectedOptions[1]?.value)
                          .filter((v): v is string => !!v)
                  ),
              ]
            : [];

    const selectedVariant = variants.find((v) => {
        const o1 = v.selectedOptions[0]?.value;
        const o2 = v.selectedOptions[1]?.value;
        if (optionNames.length > 1) return o1 === opt1 && o2 === opt2;
        if (optionNames.length === 1) return o1 === opt1;
        return true; // no options -> single variant
    });

    const displayPrice = selectedVariant?.price ?? product.priceRange.minVariantPrice;

    const canAdd =
        optionNames.length > 1
            ? opt1 !== "" && opt2 !== ""
            : optionNames.length === 1
            ? opt1 !== ""
            : true;

    const variantForCart = selectedVariant ?? variants[0];

    const handleAdd = () => {
        if (!canAdd || !variantForCart) return;
        addItem({
            id: variantForCart.id,
            title: product.title,
            price: variantForCart.price,
            image: product.images.edges[0]?.node.url,
            size: [opt1, opt2].filter(Boolean).join(" / ") || undefined,
            available: variantForCart.quantityAvailable,
        });
    };

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
                    {/* First option */}
                    {optionNames.length >= 1 && values1.length > 0 && (
                        <Dropdown full value={opt1} placeholder={`SELECCIONAR ${optionNames[0]?.toUpperCase() ?? ""}`}
                        options={values1.map((v) => ({ value: v, label: v }))}
                        onChange={(v) => { setOpt1(v); setOpt2(""); }} />
                    )}

                    {/* Second option (depends on first) */}
                    {optionNames.length > 1 && opt1 !== "" && (
                        <Dropdown full value={opt2} placeholder={`SELECCIONAR ${optionNames[1]?.toUpperCase() ?? ""}`}
                        options={values2.map((v) => ({ value: v, label: v }))}
                        onChange={(v) => { setOpt2(v) }} />
                    )}
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!canAdd}
                        className="border bg-[#FF0084] text-white w-full px-4 py-2 font-['Times_New_Roman'] font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Añadir al carro
                    </button>
                </div>
            </div>
        </>
    );
}