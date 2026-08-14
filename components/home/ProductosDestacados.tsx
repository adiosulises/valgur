import { ProductGrid } from "../ProductGrid";
import { ProductCarousel } from "./ProductCarousel";
import { ShopifyProduct } from "@/lib/shopify";
import { CardItem, Vinyl } from "@/lib/vinyl";

export function ProductosDestacados({ products, vinyls }: { products: ShopifyProduct[]; vinyls: Vinyl[] }){
    const items: CardItem[] = [
        ...products.map((p) => ({ kind: "product" as const, product: p })),
        ...vinyls.map((v) => ({ kind: "vinyl" as const, vinyl: v })),
    ];

    return(
        <>
            <div className="w-full flex flex-col px-[4%] md:px-[8%] gap-4">
                <h1 className="text-lg md:text-2xl">PRODUCTOS DESTACADOS ⸜(｡˃ ᵕ ˂ )⸝♡</h1>

                {/* Desktop */}
                <div className="hidden md:block">
                    <ProductGrid
                        items = {items}
                        maxGridHeight = {2}
                        hasPagination = {false}
                    />
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <ProductCarousel items={items} />
                </div>

                <div className="flex justify-center md:justify-end text-[#0000EE] underline">
                    <a href="/tienda">Ver más...</a>
                </div>
            </div>
        </>
    );
}
