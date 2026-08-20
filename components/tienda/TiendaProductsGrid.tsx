"use client";

import { useState } from "react";
import { ProductGrid } from "../ProductGrid";
import { TiendaMobileList } from "./TiendaMobileList";
import { ShopifyProduct } from "@/lib/shopify";
import { CardItem, Vinyl } from "@/lib/vinyl";
import { Dropdown } from "../ui/dropdown";

export function TiendaProducts({ products, vinyls }: { products: ShopifyProduct[]; vinyls: Vinyl[] }){
    const [filter, setFilter] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const filterMerch = () => setFilter((f) => (f === "merch" ? null : "merch"));
    const filterDiscos = () => setFilter((f) => (f === "discos" ? null : "discos"));

    const allItems: CardItem[] = [
        ...products.map((p) => ({ kind: "product" as const, product: p })),
        ...vinyls.map((v) => ({ kind: "vinyl" as const, vinyl: v })),
    ];

    const isDisco = (item: CardItem) =>
    item.kind === "vinyl" ||
    (item.kind === "product" && (item.product.tags?.includes("discos") ?? false));

    const filtered =
    filter === "merch"  ? allItems.filter((i) => !isDisco(i))
    : filter === "discos" ? allItems.filter(isDisco)
    : allItems;

    const label =
    filter === "merch" ? "Ropa" :
    filter === "discos" ? "CDs / Vinilos" :
    "Filtros";

    return(
        <>
            <div className="font-bold w-full flex px-[2%] md:px-[8%] gap-4">
                <div className="flex items-center gap-2">
                    <Dropdown
                        value={filter ?? ""}
                        placeholder="Filtros"
                        options={[{ value: "merch", label: "Ropa" }, { value: "discos", label: "CDs / Vinilos" }]}
                        onChange={(v) => setFilter(v || null)}
                    />
                    {filter && (
                        <button type="button" onClick={() => setFilter(null)} aria-label="Quitar filtros"
                        className="text-xs cursor-pointer">✕</button>
                    )}
                </div>
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
