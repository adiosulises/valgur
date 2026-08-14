import { ProductCard } from "@/components/ProductCard";
import { VinylCard } from "@/components/tienda/VinylCard";
import { CardItem } from "@/lib/vinyl";

export function StoreCard({ item }: { item: CardItem }) {
  return item.kind === "product" ? (
    <ProductCard product={item.product} />
  ) : (
    <VinylCard vinyl={item.vinyl} />
  );
}
