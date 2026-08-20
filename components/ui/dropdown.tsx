"use client";
import { useState } from "react";

type Option = { value: string; label: string };

export function Dropdown({
  value, placeholder, options, onChange, full = false,
}: {
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (v: string) => void;
  full?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${full ? "w-full" : "inline-block"}`}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 cursor-pointer uppercase ${full ? "w-full justify-between" : ""}`}>
        {selected ? selected.label : placeholder}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className={`absolute left-0 mt-1 z-10 bg-white border border-[#FF0084] ${full ? "w-full" : "w-48"}`}>
          {options.map((o) => (
            <button key={o.value} type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="block w-full text-left px-4 py-2 uppercase whitespace-nowrap">
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}