"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import cartIcon from "@/lib/vectors/cart.svg";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { KaomojiBurst } from "@/components/KaomojiBurst";

export default function Navbar() {

  const { t } = useLocale();
  const navLinks: { title: string; href: string }[] = [
    { title: t("nav.home"), href: "/" },
    { title: t("nav.shows"), href: "/shows" },
    { title: t("nav.shop"), href: "/tienda" },
    { title: t("nav.bio"), href: "/bio" },
  ];
  const [open, setOpen] = React.useState(false);
  const { open: openCart, items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [burst, setBurst] = React.useState(0);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBurst((b) => b + 1);
        schedule();
      }, 5000 + Math.random() * 10000); // sporadic, random 5–15s
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!open) return;
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
  }, [open]);

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b-1 border-[#FF0084] pt-[env(safe-area-inset-top)]">
      <nav className="w-full px-[8%] py-4">

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Links */}
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className="text-xl tracking-tight">
                VALGUR <span className="text-[0.6em] align-super">(mx)</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xl hover:opacity-70 transition-opacity">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          {/* Icons */}
          <div className="flex items-center gap-4">
            <LanguageDropdown />
            <button type="button" onClick={openCart} aria-label={t("nav.openCart")} className="relative cursor-pointer">
              <Image src={cartIcon} alt={t("nav.cartIconAlt")} width={20} height={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-[#FF0084] text-white text-[10px] leading-none font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-3 items-center">
          <button
            type="button"
            className="justify-self-start"
            aria-label={t("nav.toggleMenu")}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="relative justify-self-center">
            <Link href="/" className="text-xl tracking-tight whitespace-nowrap shrink-0 uppercase">
              Valgur <span className="text-[0.6em] align-super">(mx)</span>
            </Link>
            <KaomojiBurst trigger={burst} />
          </span>
          <div className="justify-self-end flex items-center gap-3">
            <LanguageDropdown />
            <button type="button" onClick={openCart} aria-label={t("nav.openCart")} className="relative cursor-pointer">
              <Image src={cartIcon} alt={t("nav.cartIconAlt")} width={20} height={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-[#FF0084] text-white text-[10px] leading-none font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
          
        </div>
        
        
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-[opacity,display] transition-discrete duration-300 starting:opacity-0
          ${open ? "opacity-100" : "opacity-0 hidden"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          h-dvh overflow-y-auto`}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)} className="text-xl font-medium">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-4 border-t border-[#FF0084] text-xs opacity-60">
          {t("nav.developedBy", { year: new Date().getFullYear() })}
        </p>
      </aside>
    </header>
  );
}
