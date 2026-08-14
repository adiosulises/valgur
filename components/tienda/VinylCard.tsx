"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Vinyl } from "@/lib/vinyl";
import designs from "@/lib/designs.json";

export function VinylCard({ vinyl }: { vinyl: Vinyl }) {
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
            alt={vinyl.title}
            fill
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
            Sin imagen
          </div>
        )}
      </Link>
      <CardContent>
        <CardTitle className="font-bold uppercase">{design ?? vinyl.title}</CardTitle>
      </CardContent>
    </Card>
  );
}
