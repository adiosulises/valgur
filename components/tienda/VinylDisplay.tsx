"use client";

import Image from "next/image";
import { Vinyl } from "@/lib/vinyl";
import { useLocale } from "@/contexts/LocaleContext";

export function VinylDisplay({ vinyl }: { vinyl: Vinyl }) {
  const { t } = useLocale();
  const images = vinyl.images.length ? vinyl.images : vinyl.image ? [vinyl.image] : [];
  const title = t("product.vinylTitlePrefix") + vinyl.title;
  const formatPrice = (p: string) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      trailingZeroDisplay: "stripIfInteger",
    }).format(parseFloat(p));

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 px-[2%] md:px-[8%]">
      {/* Imágenes */}
      <div className="flex flex-col gap-2">
        {/* Desktop: stack */}
        <div className="hidden md:flex flex-col gap-2">
          {images.map((src, i) => (
            <div key={src + i} className="relative w-full aspect-square">
              <Image src={src} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
            </div>
          ))}
        </div>
        {/* Mobile: swipe carousel */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <div key={src + i} className="relative w-full shrink-0 snap-center aspect-square">
              <Image src={src} alt={title} fill sizes="100vw" className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 md:aspect-square md:justify-center md:sticky md:top-0 md:self-start md:px-[8%]">
        <h1 className="text-[20px] font-bold uppercase">{title}</h1>
        {vinyl.price && (
          <p className="text-[20px]">
            {t("product.from")} {formatPrice(vinyl.price)} {t("product.currency")}
          </p>
        )}
        <a
          href={vinyl.buenDiaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border bg-[#FF0084] text-white w-full px-4 py-2 font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase text-center mt-2"
        >
          {t("product.goToBuenDia")}
        </a>
      </div>
    </div>
  );
}
