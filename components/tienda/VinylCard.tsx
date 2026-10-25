"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Vinyl } from "@/lib/vinyl";
import designs from "@/lib/designs.json";
import { useLocale } from "@/contexts/LocaleContext";

export function VinylCard({ vinyl }: { vinyl: Vinyl }) {
  const { t } = useLocale();
  const [design, setDesign] = React.useState<string | null>(null);

  return (
    <Card
      className="border-hidden"
      onMouseEnter={() => setDesign(designs[Math.floor(Math.random() * designs.length)])}
      onMouseLeave={() => setDesign(null)}
    >
      <Link
        href={`/tienda/${vinyl.handle}`}
        className="relative h-40 md:h-48 w-full overflow-hidden block"
      >
        {vinyl.image ? (
          <Image
            src={vinyl.image}
            alt={t("product.vinylTitlePrefix") + vinyl.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
            {t("product.noImage")}
          </div>
        )}
      </Link>
      <CardContent>
        <CardTitle className="font-bold uppercase text-[20px]">{design ?? t("product.vinylTitlePrefix") + vinyl.title}</CardTitle>
        {vinyl.price && (
          <p className="text-[20px]">
            {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", trailingZeroDisplay: "stripIfInteger" }).format(parseFloat(vinyl.price))} {t("product.currency")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
