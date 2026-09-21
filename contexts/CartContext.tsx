"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export type CartItem = {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image?: string;
  size?: string;
  available: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { lang } = useLocale();
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  // Cart items keep the price they had when added (and are persisted), so
  // reprice them in the current market when the language/market changes and when
  // a saved cart loads. The server reads the market from the "lang" cookie.
  useEffect(() => {
    const ids = itemsRef.current.map((i) => i.id);
    if (!loaded || ids.length === 0) return;
    let ignore = false;
    fetch("/api/cart-prices", { method: "POST", body: JSON.stringify({ ids }) })
      .then((res) => res.json())
      .then(({ prices }: { prices: { id: string; price: CartItem["price"] }[] }) => {
        if (ignore || !prices?.length) return;
        const byId = new Map(prices.map((p) => [p.id, p.price]));
        setItems((prev) => prev.map((i) => ({ ...i, price: byId.get(i.id) ?? i.price })));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loaded, lang]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.available) }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, i.available) } : i
      )
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
      )
    );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  

  return (
    <CartContext.Provider
      value={{ items, isOpen, addItem, removeItem, increment, decrement, open, close }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
