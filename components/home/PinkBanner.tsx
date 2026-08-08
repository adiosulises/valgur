"use client";

import { useState, useEffect } from "react";

const DESIGNS = [
  "(✿˶◕‿◕˶人◕ᴗ◕✿)",
  "ଘ( ੭*ˊᵕˋ)੭ * ੈ ♡  ‧₊˚",
  "౨ৎ⋆ ｡⋆𐙚⋆.˚₊⊹♡",
  "ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧",
];


export function PinkBanner({ transparent = false }: { transparent?: boolean }) {

    const [i, setI] = useState(0);

    useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % DESIGNS.length), 3000);
    return () => clearInterval(id);
    }, []);

    return(
        <div className={`w-full h-[64px] py-4 text-2xl font-bold ${transparent ? "text-[#FF0084]" : "bg-[#FF0084] text-white"}`}>
            {/* Desktop */}
            <div className="hidden md:block overflow-hidden">
                <div className="flex w-max animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
                    {[...DESIGNS, ...DESIGNS].map((d, i) => (
                    <span key={i} className="px-8 whitespace-nowrap">{d}</span>
                    ))}
                </div>
            </div>
            {/* Mobile */}
            <div className="flex md:hidden w-full justify-center items-center px-[4%] ">
                <span className="transition-opacity duration-300">{DESIGNS[i]}</span>
            </div>
        </div>
    );
}