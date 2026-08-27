import { notFound } from "next/navigation";
import { SlugDisplay } from "@/components/tienda/SlugDisplay";
import { VinylDisplay } from "@/components/tienda/VinylDisplay";
import { PinkBanner } from "@/components/home/PinkBanner";
import { Recomendados } from "@/components/tienda/Recomendados";
import { getProduct, getProducts, getArticlesByBlogHandle } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Item({ params }: PageProps) {

  const { slug } = await params;

  const { body } = await getProduct(slug[0]);
  const product = body.data.product;

  const articles = await getArticlesByBlogHandle("releases");
  const allVinyls = await getVinyls(articles);

  // Not a product? Try a vinyl (a "releases" article that has a Buen Dia Records link).
  const vinyl = product ? null : allVinyls.find((v) => v.handle === slug[0]) ?? null;

  if (!product && !vinyl) {
    notFound();
  }

  const { body: productsBody } = await getProducts();
  const products = productsBody.data.products.edges
    .map((e) => e.node)
    .filter((p) => p.handle !== (product?.handle ?? ""));
  const recVinyls = allVinyls.filter((v) => v.handle !== (vinyl?.handle ?? ""));

  return (
    <>
      {product ? <SlugDisplay product={product} /> : <VinylDisplay vinyl={vinyl!} />}
      <div className="md:hidden py-4">
        <PinkBanner transparent />
      </div>
      <div className="py-8">
        <Recomendados products={products} vinyls={recVinyls} />
      </div>
    </>
  );
}
