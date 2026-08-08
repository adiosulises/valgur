import { notFound } from "next/navigation";
import { SlugDisplay } from "@/components/tienda/SlugDisplay";
import { PinkBanner } from "@/components/home/PinkBanner";
import { ShopifyProduct, getProduct } from "@/lib/shopify";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Item({ params }: PageProps) {

  const { slug } = await params;

  const { body } = await getProduct(slug[0]);
  const product = body.data.product;

  if (!product) {
    notFound();
  }

  return (
    <>
      <SlugDisplay product={product}/>
      <div className="py-4">
        <PinkBanner transparent />
      </div>
    </>
  );
}
