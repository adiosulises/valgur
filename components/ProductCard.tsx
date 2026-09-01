"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct, productHasPriceRange } from "@/lib/shopify";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import designs from "@/lib/designs.json";


export function ProductCard({product} : {product : ShopifyProduct}){

    const [isCartHovered, setIsCartHovered] = React.useState(false);
    const [design, setDesign] = React.useState<string | null>(null);
    
    const image = product.images.edges[0]?.node;
    const formatPrice = (price: { amount: string; currencyCode: string }) => 
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));

    // const isOutOfStock = !product.availableForSale;

    return(
        <>
            <Card 
                className="border-hidden"
                onMouseEnter={() => setDesign(designs[Math.floor(Math.random() * designs.length)])}
                onMouseLeave={() => setDesign(null)}
            >
                <Link href={`/tienda/${product.handle}`} className="relative h-40 md:h-48 w-full overflow-hidden block">
                    {image ? (
                    <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover/card:scale-110"
                    />
                    ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
                        Sin imagen
                    </div>
                    )}
                </Link>
                 <CardContent>
                    <CardTitle className="font-bold text-[20px]">{design ?? product.title}</CardTitle>
                    <p className="text-[20px]">
                        {productHasPriceRange(product)
                            ? `${formatPrice(product.priceRange.minVariantPrice)} – ${formatPrice(product.priceRange.maxVariantPrice)}`
                            : formatPrice(product.variants.edges[0]?.node.price)}
                    </p>
                 </CardContent>
            </Card>
        </>
    );
}