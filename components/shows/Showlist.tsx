"use client";

import Link from "next/link";
import type { ShopifyArticle } from "@/lib/shopify";

type Guest = { name: string; symbol: string };

type ParsedShow = {
  ubicacion: string;
  fecha: string;
  tickets: string;
  invitados: Guest[];
  agotado: boolean;
  parsedFecha: Date;
};

function extract(html: string | null | undefined, label: string): string {
  const m = html?.match(new RegExp(`${label}:[ \\t]*([^\\n]*)`));
  return m?.[1]?.trim() ?? "";
}

function htmlToText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ");
}

function parseFecha(fecha: string): Date {
  const [d, m, y] = fecha.split(".").map(Number);
  return new Date(y, m - 1, d);   // month is 0-indexed
}

function parseShow(article: ShopifyArticle): ParsedShow[] { 
  const text = htmlToText(article.contentHtml);
  const blocks = text.split(/(?=Ubicacion:)/i).filter((b) => /Ubicacion:/i.test(b));

  return blocks.map((block) => { // *
    const invitadoRaw = extract(block, "Invitado");

    const invitados: Guest[] = invitadoRaw
      ? invitadoRaw.split(",").map((g) => {
            const [name, symbol] = g.split("-").map((s) => s.trim());
            return { name: name ?? "", symbol: symbol ?? "" };
        })
      : [];

    return {
      ubicacion: extract(block, "Ubicacion"),
      fecha: extract(block, "Fecha"),
      tickets: extract(block, "Tickets"),
      invitados,
      agotado: extract(block, "Estatus") === "Agotado",
      parsedFecha: parseFecha(extract(block, "Fecha")),
    };
  });
}

export function Showlist({ shows }: { shows: ShopifyArticle [] }){

    const parsed = shows
    .flatMap(parseShow);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = parsed
    .filter((s) => s.parsedFecha >= today)
    .sort((a, b) => a.parsedFecha.getTime() - b.parsedFecha.getTime());

    const guests = [
    ...new Map(
      upcoming.flatMap((p) => p.invitados).map((g) => [g.symbol + g.name, g])
    ).values(),
  ];

  return (
    <>
    <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col px-[8%] py-12">
        {upcoming.map((show, i) => {
            const strike = show.agotado ? "line-through" : "";
            const href = show.tickets.startsWith("http")
            ? show.tickets
            : `https://${show.tickets}`;

            return (
            <div key={i} className="text-xl flex items-center justify-between py-2">
                <span className={strike}>
                <span className="inline-block w-28">{show.fecha}</span>
                {show.ubicacion}
                {show.invitados.map((g) => ` ${g.symbol}`).join("")}
                </span>
                {show.agotado ? (
                    <span className="text-[#0000EE] line-through">Tickets</span>
                    ) : (
                    <Link href={href} target="_blank" rel="noopener noreferrer" className="text-[#0000EE] underline">
                        Tickets
                    </Link>
                )}
            </div>
            );
        })}

        {guests.length > 0 && (
            <div className="pt-30">
            {guests.map((g) => (
                <p key={g.symbol + g.name}>
                {g.symbol} Con {g.name}
                </p>
            ))}
            </div>
        )}
        
        </div>
        <div className="text-right text-[#0000EE] font-bold underline flex flex-row items-center justify-end gap-4 px-[8%] py-8 mt-auto">
            <a href="/bio">Contacto</a>
            <a href="/bio">Booking US / EU</a>
            <a href="/bio">Booking MX / Latam</a>
        </div>
    </div>
    </>
  );
}