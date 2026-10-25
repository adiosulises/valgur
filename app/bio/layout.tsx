import type { Metadata } from "next";
import { getLang } from "@/lib/market";
import { PAGE_META, OG_DESCRIPTION } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { title, description } = PAGE_META.bio[lang];
  return { title, description, alternates: { canonical: "/bio" }, openGraph: { title, description: OG_DESCRIPTION[lang], url: "/bio" } };
}

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
