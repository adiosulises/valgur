import Image from "next/image";
import { Vinyl } from "@/lib/vinyl";

export function VinylDisplay({ vinyl }: { vinyl: Vinyl }) {
  const images = vinyl.images.length ? vinyl.images : vinyl.image ? [vinyl.image] : [];
  const formatPrice = (p: string) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      trailingZeroDisplay: "stripIfInteger",
    }).format(parseFloat(p));

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 px-[2%] md:px-[8%]">
      {/* Imágenes */}
      <div className="flex flex-col gap-4">
        {/* Desktop: stack */}
        <div className="hidden md:flex flex-col gap-4">
          {images.map((src, i) => (
            <div key={src + i} className="relative w-full aspect-square">
              <Image src={src} alt={vinyl.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
            </div>
          ))}
        </div>
        {/* Mobile: swipe carousel */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <div key={src + i} className="relative w-full shrink-0 snap-center aspect-square">
              <Image src={src} alt={vinyl.title} fill sizes="100vw" className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4 md:aspect-square md:justify-center md:px-[8%]">
        <h1 className="text-l font-bold uppercase">{vinyl.title}</h1>
        {vinyl.price && (
          <p>
            Desde {formatPrice(vinyl.price)} MXN
          </p>
        )}
        <a
          href={vinyl.buenDiaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border bg-[#FF0084] text-white w-full px-4 py-2 font-['Times_New_Roman'] font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase text-center"
        >
          Ir a Buen Dia Records
        </a>
      </div>
    </div>
  );
}
