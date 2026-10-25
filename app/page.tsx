import { ShopifyProduct, ShopifyArticle, getProducts, getArticlesByBlogHandle } from "@/lib/shopify";
import { getVinyls } from "@/lib/vinyl";
import { getCountry } from "@/lib/market";
import { parseReleases } from "@/lib/releases";
import { parseHero, pickLatest } from "@/lib/hero";
import { getBandcampAlbumId } from "@/lib/bandcamp";
import { PinkBanner } from "@/components/home/PinkBanner";
import { Hero } from "@/components/home/Hero";
import { ProductosDestacados } from "@/components/home/ProductosDestacados";
import { ReleasesDestacados } from "@/components/home/ReleasesDestacados";
import { YoutubeEmbed } from "@/components/home/YoutubeEmbed";

export default async function Home() {

  const country = await getCountry();

  // Hero: latest article of the "hero" blog (renders nothing if there isn't one)
  const latestHero = pickLatest(await getArticlesByBlogHandle('hero', 5, 'force-cache', 60));
  const hero = latestHero ? parseHero(latestHero) : null;

  // getProducts para grid de productos destacados
  const { body: productsBody } = await getProducts(undefined, country);
  const products: ShopifyProduct[] = productsBody.data.products.edges.map((e) => e.node);

  // getArticles para releases -> ordenar primero los de tag 'destacado'
  const rawReleases = await getArticlesByBlogHandle('releases');
  const hasDestacadoTag = (a: ShopifyArticle) => a.tags?.includes("destacado") ?? false;
  const releases = [
    ...rawReleases.filter(hasDestacadoTag),
    ...rawReleases.filter((a) => !hasDestacadoTag(a)),
  ];

  // Bandcamp embed id per release (keyed by article handle) for the music player
  const embedIds: Record<string, string | null> = Object.fromEntries(
    await Promise.all(
      parseReleases(releases).map(async (r) => [
        r.handle,
        r.links.bandcamp ? await getBandcampAlbumId(r.links.bandcamp) : null,
      ] as const)
    )
  );

  // Vinyls (releases with a Buen Dia Records link) for the featured grid
  const vinyls = await getVinyls(rawReleases);

  // getArticles para videos musicales -> mostrar solo 1, randomizado, priorizando tags 'destacado'
  const rawVideos = await getArticlesByBlogHandle('videos');
  const destacados = rawVideos.filter(hasDestacadoTag);
  const videos = destacados.length > 0 ? destacados : rawVideos;

  return (
    <>

      {/* Hero: ultimo single */}
      {hero && (
        <>
          <Hero hero={hero}/>
          <PinkBanner/>
        </>
      )}

      {/* Productos Destacados */}
      <ProductosDestacados products={products} vinyls={vinyls}/>
      
      {/* Banner */}
      <PinkBanner/>

      {/* Musica/Releases */}
      <ReleasesDestacados releases={releases} embedIds={embedIds}/>

      {/* Banner */}
      <PinkBanner/>

      {/* Video Destacado */}
      <YoutubeEmbed videos={videos}/>

    </>
  );
}
