"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export function CartSidebar() {
  const { items, isOpen, close, removeItem, increment, decrement } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const formatPrice = (price: { amount: string; currencyCode: string }) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currencyCode,
      trailingZeroDisplay: "stripIfInteger",
    }).format(parseFloat(price.amount));

  const checkout = async () => {
    const res = await fetch ("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
    const { url } = await res.json();
    if (url) window.location.href=url;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center opacity-60 py-8">Tu carrito está vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold uppercase">{item.title}</span>
                    <span>{formatPrice(item.price)} MXN</span>
                    {item.size && (
                      <span className="uppercase opacity-60">{item.size}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Quitar del carrito"
                    className="text-xs cursor-pointer ml-auto"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => decrement(item.id)}
                    disabled={item.quantity <= 1}
                    aria-label="Restar"
                    className="px-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increment(item.id)}
                    disabled={item.quantity >= item.available}
                    aria-label="Sumar"
                    className="px-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4">
          <button
            onClick={checkout}
            type="button"
            className="border bg-[#FF0084] text-white w-full px-4 py-2 font-['Times_New_Roman'] font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase"
          >
            Ir al pago
          </button>
        </div>
      </aside>
    </>
  );
}
