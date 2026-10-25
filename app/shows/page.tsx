import { Showlist } from "@/components/shows/Showlist";
import { getArticlesByBlogHandle } from "@/lib/shopify";
import type { Metadata } from "next";
import { getLang } from "@/lib/market";
import { PAGE_META, OG_DESCRIPTION } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { title, description } = PAGE_META["shows"][lang];
  return { title, description, alternates: { canonical: "/shows" }, openGraph: { title, description: OG_DESCRIPTION[lang], url: "/shows" } };
}


export default async function Shows() {

  const shows = await getArticlesByBlogHandle('shows');

  return (
    <> 
      <Showlist shows={shows} />
    </>
  );
}
