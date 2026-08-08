const DESIGNS = [
  "(✿˶◕‿◕˶人◕ᴗ◕✿)",
  "ଘ( ੭*ˊᵕˋ)੭ * ੈ ♡  ‧₊˚",
  "౨ৎ⋆ ｡⋆𐙚⋆.˚₊⊹♡",
  "ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧",
];


export function PinkBanner({ transparent = false }: { transparent?: boolean }) {

    const random = DESIGNS[Math.floor(Math.random() * DESIGNS.length)];

    return(
        <div className={`w-full h-[64px] px-[4%] md:px-[8%] py-4 text-2xl font-bold ${transparent ? "text-[#FF0084]" : "bg-[#FF0084] text-white"}`}>
            {/* Desktop */}
            <div className="hidden md:flex w-full justify-between items-center">
                {DESIGNS.map((d, i) => <span key={i}>{d}</span>)}
            </div>
            {/* Mobile */}
            <div className="flex md:hidden w-full justify-center items-center">
                <span>{random}</span>
            </div>
        </div>
    );
}