import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SlugDisplay } from "@/components/tienda/SlugDisplay";
import { VinylDisplay } from "@/components/tienda/VinylDisplay";
import { PinkBanner } from "@/components/home/PinkBanner";
import { Recomendados } from "@/components/tienda/Recomendados";
import { getProduct, getProducts, getArticlesByBlogHandle } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { getCountry } from "@/lib/market";
import { SITE_URL, SITE_NAME } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const clip = (text: string, max = 160) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountry();
  const { body } = await getProduct(slug[0], country);
  const product = body.data.product;

  if (product) {
    const image = product.images.edges[0]?.node.url;
    const description = clip(product.description || `${product.title} — ${SITE_NAME}`);
    return {
      title: product.title,
      description,
      alternates: { canonical: `/tienda/${product.handle}` },
      openGraph: { title: product.title, description, url: `/tienda/${product.handle}`, ...(image && { images: [image] }) },
    };
  }

  const vinyl = (await getVinyls(await getArticlesByBlogHandle("releases"))).find((v) => v.handle === slug[0]);
  if (!vinyl) return { title: "404", robots: { index: false } };
  return {
    title: `Vinyl ${vinyl.title}`,
    description: `${vinyl.title} — Valgur`,
    alternates: { canonical: `/tienda/${vinyl.handle}` },
    openGraph: { title: `Vinyl ${vinyl.title}`, url: `/tienda/${vinyl.handle}`, ...(vinyl.image && { images: [vinyl.image] }) },
  };
}

export default async function Item({ params }: PageProps) {

  const { slug } = await params;
  const country = await getCountry();

  const { body } = await getProduct(slug[0], country);
  const product = body.data.product;

  const articles = await getArticlesByBlogHandle("releases");
  const allVinyls = await getVinyls(articles);

  // Not a product? Try a vinyl (a "releases" article that has a Buen Dia Records link).
  const vinyl = product ? null : allVinyls.find((v) => v.handle === slug[0]) ?? null;

  if (!product && !vinyl) {
    notFound();
  }

  const { body: productsBody } = await getProducts(undefined, country);
  const products = productsBody.data.products.edges
    .map((e) => e.node)
    .filter((p) => p.handle !== (product?.handle ?? ""));
  const recVinyls = allVinyls.filter((v) => v.handle !== (vinyl?.handle ?? ""));

  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.images.edges.map((e) => e.node.url),
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/tienda/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
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
