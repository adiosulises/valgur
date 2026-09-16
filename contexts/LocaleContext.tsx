"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

export type Lang = "ES" | "EN";
type Messages = typeof es;

const MESSAGES: Record<Lang, Messages> = { ES: es, EN: en };

type LocaleContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function resolve(messages: Messages, path: string): string {
  const value = path.split(".").reduce<unknown>((obj, key) => {
    if (obj && typeof obj === "object" && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);
  return typeof value === "string" ? value : path;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>("ES");

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "ES" || stored === "EN") setLangState(stored);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("lang", next);
    // Also mirrored into a cookie: server components read this to pick the
    // Shopify market/country context (@inContext), so prices switch too.
    document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const t = (path: string, vars?: Record<string, string | number>) => {
    let text = resolve(MESSAGES[lang], path);
    if (vars) {
      for (const [key, value] of Object.entries(vars)) {
        text = text.replace(`{${key}}`, String(value));
      }
    }
    return text;
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
