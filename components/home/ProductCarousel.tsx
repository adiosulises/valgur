"use client";

import { useState } from "react";
import Image from "next/image";
import { StoreCard } from "@/components/StoreCard";
import { CardItem } from "@/lib/vinyl";
import leftNav from "@/lib/vectors/releases_leftnav.svg";
import rightNav from "@/lib/vectors/releases_rightnav.svg";

export function ProductCarousel({ items }: { items: CardItem[] }) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-1 w-full">
        <StoreCard item={items[index]} />
      </div>
      <div className="flex justify-center items-center gap-4">
        <button type="button" onClick={goPrev} aria-label="Anterior" className="shrink-0 cursor-pointer">
          <Image src={leftNav} alt="" width={20} height={20} />
        </button>
        <button type="button" onClick={goNext} aria-label="Siguiente" className="shrink-0 cursor-pointer">
          <Image src={rightNav} alt="" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
