"use client";

import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "ES", label: "Español" },
  { code: "EN", label: "English" },
];

export function LanguageDropdown() {
  const [lang, setLang] = useState("ES");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored) setLang(stored);
  }, []);

  const select = (code: string) => {
    setLang(code);
    localStorage.setItem("lang", code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Seleccionar idioma"
        className="flex items-center gap-1 cursor-pointer uppercase text-sm font-medium"
      >
        {lang}
        <span className={`transition-transform text-xs ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 z-10 bg-white border border-[#FF0084] w-24">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => select(l.code)}
              className={`block w-full text-left px-3 py-2 uppercase text-sm cursor-pointer ${
                lang === l.code ? "bg-[#FF0084] text-white" : ""
              }`}
            >
              {l.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
