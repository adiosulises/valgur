"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import cartIcon from "@/lib/vectors/cart.svg";
import globeIcon from "@/lib/vectors/globe.svg";

const navLinks: { title: string; href: string }[] = [
  { title: "Inicio", href: "/" },
  { title: "Shows", href: "/shows" },
  { title: "Tienda", href: "/tienda" },
  { title: "Bio", href: "/bio" },
];

export default function Navbar() {

  const [open, setOpen] = React.useState(false);

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
    <header className="w-full">
      <nav className="w-full px-[8%] py-4">

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Links */}
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className="text-xl tracking-tight">
                Valgur <span className="text-[0.6em] align-super">(mx)</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xl font-medium hover:opacity-70 transition-opacity">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          {/* Icons */}
          <div className="flex items-center gap-4">
            <Image src={globeIcon} alt="Language" width={20} height={20} />
            <Image src={cartIcon} alt="Cart" width={20} height={20} />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-3 items-center">
          <button
            type="button"
            className="justify-self-start"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="
            text-xl 
            tracking-tight 
            justify-self-center 
            whitespace-nowrap
            shrink-0
            ">
            Valgur <span className="text-[0.6em] align-super">(mx)</span>
          </Link>
          <div className="justify-self-end">
            <Image src={cartIcon} alt="Cart" width={20} height={20} />
          </div>
          
        </div>
        
        
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 md:hidden
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
      </aside>
    </header>
  );
}
