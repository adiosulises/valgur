"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct } from "@/lib/shopify";

const PAGE_SIZE = 4;

export function TiendaMobileList({ products }: { products: ShopifyProduct[] }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col">
        {visibleProducts.map((product, i) => (
          <div key={product.handle}>
            <ProductCard product={product} />
            {i < visibleProducts.length - 1 && (
              <div
                className="h-px w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, currentColor 0 8px, transparent 8px 16px)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="disabled:invisible cursor-pointer"
          >
            {'<:::::::::::::::::}==-'}
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="disabled:invisible cursor-pointer"
          >
            {'+=={:::::::::::::::::>'}
          </button>
        </div>
      )}
    </>
  );
}
