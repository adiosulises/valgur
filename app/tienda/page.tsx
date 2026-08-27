import { getProducts, getArticlesByBlogHandle, ShopifyProduct } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { TiendaProducts } from "@/components/tienda/TiendaProductsGrid";

export default async function Tienda() {
  const { body } = await getProducts();
  const products: ShopifyProduct[] = body.data.products.edges.map((e) => e.node);

  const articles = await getArticlesByBlogHandle("releases");
  const vinyls = await getVinyls(articles);

  return <TiendaProducts products={products} vinyls={vinyls} />;
}
