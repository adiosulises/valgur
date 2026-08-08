"use client";

import { useState, useEffect } from "react";
import designs from "@/lib/designs.json";


export function PinkBanner({ transparent = false }: { transparent?: boolean }) {

    const [i, setI] = useState(0);

    useEffect(() => {
    const id = setInterval(() => setI((prev) => {
        if (designs.length < 2) return prev;
        let n = prev;
        do { n = Math.floor(Math.random() * designs.length); } while (n === prev);
        return n;
    }), 800);
    return () => clearInterval(id);
    }, []);

    return(
        <div className={`w-full h-[64px] py-4 text-2xl font-bold ${transparent ? "text-[#FF0084]" : "bg-[#FF0084] text-white"}`}>
            {/* Desktop */}
            <div className="hidden md:block overflow-hidden">
                <div className="flex w-max animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
                    {[...designs, ...designs].map((d, i) => (
                    <span key={i} className="px-8 whitespace-nowrap">{d}</span>
                    ))}
                </div>
            </div>
            {/* Mobile */}
            <div className="flex md:hidden w-full justify-center items-center px-[4%] ">
                <span className="transition-opacity duration-300">{designs[i]}</span>
            </div>
        </div>
    );
}