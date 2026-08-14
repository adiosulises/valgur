import { ProductGrid } from "@/components/ProductGrid";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ShopifyProduct } from "@/lib/shopify";
import { CardItem, Vinyl } from "@/lib/vinyl";

export function Recomendados({ products, vinyls }: { products: ShopifyProduct[]; vinyls: Vinyl[] }) {
  const all: CardItem[] = [
    ...products.map((p) => ({ kind: "product" as const, product: p })),
    ...vinyls.map((v) => ({ kind: "vinyl" as const, vinyl: v })),
  ];
  const items = [...all].sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="w-full flex flex-col px-[4%] md:px-[8%] gap-4">
      <h1 className="text-lg md:text-2xl">PRODUCTOS RECOMENDADOS ⸜(｡˃ ᵕ ˂ )⸝♡</h1>

      {/* Desktop */}
      <div className="hidden md:flex md:flex-col gap-4">
        <ProductGrid items={items} maxGridHeight={1} hasPagination={false} />
        <div className="flex justify-end text-[#0000EE] underline">
          <a href="/tienda">Ver más...</a>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        <ProductCarousel items={items} />
        <div className="flex justify-center text-[#0000EE] underline">
          <a href="/tienda">Ver más...</a>
        </div>
      </div>
    </div>
  );
}
