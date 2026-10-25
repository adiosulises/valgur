import { getProducts, getArticlesByBlogHandle, ShopifyProduct } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { getCountry } from "@/lib/market";
import { TiendaProducts } from "@/components/tienda/TiendaProductsGrid";
import type { Metadata } from "next";
import { getLang } from "@/lib/market";
import { PAGE_META, OG_DESCRIPTION } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { title, description } = PAGE_META["tienda"][lang];
  return { title, description, alternates: { canonical: "/tienda" }, openGraph: { title, description: OG_DESCRIPTION[lang], url: "/tienda" } };
}

export default async function Tienda() {
  const country = await getCountry();
  const { body } = await getProducts(undefined, country);
  const products: ShopifyProduct[] = body.data.products.edges.map((e) => e.node);

  const articles = await getArticlesByBlogHandle("releases");
  const vinyls = await getVinyls(articles);

  return <TiendaProducts products={products} vinyls={vinyls} />;
}
