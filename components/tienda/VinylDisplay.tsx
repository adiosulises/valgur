import Image from "next/image";
import { Vinyl } from "@/lib/vinyl";

export function VinylDisplay({ vinyl }: { vinyl: Vinyl }) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 px-[2%] md:px-[8%]">
      {/* Imagen */}
      <div className="relative w-full aspect-square">
        {vinyl.image && (
          <Image
            src={vinyl.image}
            alt={vinyl.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        )}
      </div>
      {/* Info */}
      <div className="flex flex-col gap-4 md:aspect-square md:justify-center md:px-[8%]">
        <h1 className="text-l font-bold uppercase">{vinyl.title}</h1>
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
