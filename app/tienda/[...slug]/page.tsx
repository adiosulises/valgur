import { notFound } from "next/navigation";
import { SlugDisplay } from "@/components/tienda/SlugDisplay";
import { PinkBanner } from "@/components/home/PinkBanner";
import { Recomendados } from "@/components/tienda/Recomendados";
import { ShopifyProduct, getProduct, getProducts } from "@/lib/shopify";

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

  const { body: productsBody } = await getProducts();
  const products = productsBody.data.products.edges
    .map((e) => e.node)
    .filter((p) => p.handle !== product.handle);

  return (
    <>
      <SlugDisplay product={product}/>
      <div className="md:hidden py-4">
        <PinkBanner transparent />
      </div>
      <div className="py-8">
        <Recomendados products={products} />
      </div>
    </>
  );
}
