import { Showlist } from "@/components/shows/Showlist";
import { getArticlesByBlogHandle } from "@/lib/shopify";


export default async function Shows() {

  const shows = await getArticlesByBlogHandle('shows');

  return (
    <> 
      <Showlist shows={shows} />
    </>
  );
}
