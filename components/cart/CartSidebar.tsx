"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";

export function CartSidebar() {
  const { t } = useLocale();
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
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center opacity-60 py-8">{t("cart.empty")}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 border-b-1 p-4 border-[#FF0084] w-full">
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
                    <span>{formatPrice(item.price)}</span>
                    {item.size && (
                      <span className="uppercase opacity-60">{item.size}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={t("cart.remove")}
                    className="text-xs cursor-pointer ml-auto"
                  >
                    {t("cart.removeGlyph")}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => (item.quantity <= 1 ? removeItem(item.id) : decrement(item.id))}
                    aria-label={t("cart.decrement")}
                    className="px-2 cursor-pointer"
                  >
                    {t("cart.decrementGlyph")}
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increment(item.id)}
                    disabled={item.quantity >= item.available}
                    aria-label={t("cart.increment")}
                    className="px-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("cart.incrementGlyph")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 text-white bg-[#FF0084]">
          {items.length > 0 && (
            <p className="flex justify-between uppercase mb-2 text-xl">
              <span className="font-normal">{t("cart.total")}</span>
              <span className="font-bold">
                {formatPrice({
                  amount: items
                    .reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0)
                    .toString(),
                  currencyCode: items[0].price.currencyCode,
                })}
              </span>
            </p>
          )}
          <button
            onClick={checkout}
            type="button"
            className="border text-[#FF0084] bg-white w-full px-4 py-2 font-['Times_New_Roman'] font-bold italic text-[20px] leading-none tracking-normal cursor-pointer uppercase"
          >
            {t("cart.checkout")}
          </button>
        </div>
      </aside>
    </>
  );
}
