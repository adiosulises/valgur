import Link from "next/link";
import { getLang } from "@/lib/market";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

export default async function NotFound() {
  const m = ((await getLang()) === "ES" ? es : en).errors;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-[8%] py-16 text-center">
      <p className="font-mono text-xs tracking-[0.2em] opacity-60">404</p>
      <h1 className="font-bold text-3xl md:text-5xl leading-none">{m.notFoundTitle}</h1>
      <p className="max-w-md">{m.notFoundBody}</p>
      <Link href="/" className="border bg-[#FF0084] text-white px-6 py-3 font-bold italic text-[20px] leading-none uppercase hover:opacity-90 transition-opacity">
        {m.backHome} &rarr;
      </Link>
    </div>
  );
}
