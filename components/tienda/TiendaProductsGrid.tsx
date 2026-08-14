"use client";

import { useState } from "react";
import { ProductGrid } from "../ProductGrid";
import { TiendaMobileList } from "./TiendaMobileList";
import { ShopifyProduct } from "@/lib/shopify";
import { CardItem, Vinyl } from "@/lib/vinyl";

export function TiendaProducts({ products, vinyls }: { products: ShopifyProduct[]; vinyls: Vinyl[] }){
    const [filter, setFilter] = useState<string | null>(null);

    const filterMerch = () => setFilter((f) => (f === "merch" ? null : "merch"));
    const filterDiscos = () => setFilter((f) => (f === "discos" ? null : "discos"));

    // Merch = store products, Discos = article-derived vinyls
    const allItems: CardItem[] = [
        ...products.map((p) => ({ kind: "product" as const, product: p })),
        ...vinyls.map((v) => ({ kind: "vinyl" as const, vinyl: v })),
    ];

    const filtered =
        filter === "merch" ? allItems.filter((i) => i.kind === "product")
        : filter === "discos" ? allItems.filter((i) => i.kind === "vinyl")
        : allItems;

    return(
        <>
            <div className="font-bold w-full flex px-[2%] md:px-[8%] gap-4">
                <button
                    className={`underline ${filter === "merch" ? "text-[#FF0084]" : ""}`}
                    type="button"
                    onClick={filterMerch}
                    aria-label="Merch"
                >
                    Merch
                </button>
                <span>/</span>
                <button
                    className={`underline ${filter === "discos" ? "text-[#FF0084]" : ""}`}
                    type="button"
                    onClick={filterDiscos}
                    aria-label="Discos"
                >
                    Discos
                </button>
                <button
                    className={`text-xs cursor-pointer ${filter ? "" : "invisible"}`}
                    type="button"
                    onClick={() => setFilter(null)}
                    aria-label="Quitar filtros"
                >
                    ✕
                </button>
            </div>
            <div className="w-full flex flex-col px-[2%] md:px-[8%] gap-4">
                {/* Desktop */}
                <div className="hidden md:block">
                    <ProductGrid
                        key = {filter ?? "all"}
                        items = {filtered}
                        maxGridHeight = {4}
                        hasPagination = {true}
                    />
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <TiendaMobileList key={filter ?? "all"} items={filtered} />
                </div>
            </div>
        </>
    );
}
