import { ShopifyProduct, ShopifyArticle, getProducts, getArticlesByBlogHandle } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { PinkBanner } from "@/components/home/PinkBanner";
import { ProductosDestacados } from "@/components/home/ProductosDestacados";
import { ReleasesDestacados } from "@/components/home/ReleasesDestacados";
import { YoutubeEmbed } from "@/components/home/YoutubeEmbed";

export default async function Home() {


  // getProducts para grid de productos destacados
  const { body: productsBody } = await getProducts();
  const products: ShopifyProduct[] = productsBody.data.products.edges.map((e) => e.node);

  // getArticles para releases -> ordenar primero los de tag 'destacado'
  const rawReleases = await getArticlesByBlogHandle('releases');
  const hasDestacadoTag = (a: ShopifyArticle) => a.tags?.includes("destacado") ?? false;
  const releases = [
    ...rawReleases.filter(hasDestacadoTag),
    ...rawReleases.filter((a) => !hasDestacadoTag(a)),
  ];

  // Vinyls (releases with a Buen Dia Records link) for the featured grid
  const vinyls = await getVinyls(rawReleases);

  // getArticles para videos musicales -> mostrar solo 1, randomizado, priorizando tags 'destacado'
  const rawVideos = await getArticlesByBlogHandle('videos');
  console.log("rawVideos:", rawVideos); 
  const destacados = rawVideos.filter(hasDestacadoTag);
  const videos = destacados.length > 0 ? destacados : rawVideos;
  console.log("videos pool:", videos);

  return (
    <>

      {/* Productos Destacados */}
      <ProductosDestacados products={products} vinyls={vinyls}/>
      
      {/* Banner */}
      <PinkBanner/>

      {/* Musica/Releases */}
      <ReleasesDestacados releases={releases}/>

      {/* Banner */}
      <PinkBanner/>

      {/* Video Destacado */}
      <YoutubeEmbed videos={videos}/>

    </>
  );
}
