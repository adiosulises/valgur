"use client";

import { useState } from "react";
import { StoreCard } from "@/components/StoreCard";
import { CardItem } from "@/lib/vinyl";

const PAGE_SIZE = 4;

const keyOf = (item: CardItem) =>
  item.kind === "product" ? item.product.handle : item.vinyl.handle;

export function TiendaMobileList({ items }: { items: CardItem[] }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visibleItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col">
        {visibleItems.map((item, i) => (
          <div key={keyOf(item)}>
            <StoreCard item={item} />
            {i < visibleItems.length - 1 && (
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
