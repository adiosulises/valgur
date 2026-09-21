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

// The "lang" cookie is the single source of truth: server components read it to
// pick the Shopify market/country context (@inContext), so the UI language has
// to follow the same value or the language and the prices can disagree.
function readLangCookie(): Lang | null {
  const match = document.cookie.match(/(?:^|;\s*)lang=(ES|EN)(?:;|$)/);
  return match ? (match[1] as Lang) : null;
}

function writeLangCookie(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>("ES");

  useEffect(() => {
    const fromCookie = readLangCookie();
    if (fromCookie) {
      setLangState(fromCookie);
      return;
    }
    // Legacy: the language used to be stored only in localStorage, so the
    // server never saw it. Move it into the cookie (and re-render the server
    // components with the right market) once, then drop the old value.
    try {
      const legacy = localStorage.getItem("lang");
      localStorage.removeItem("lang");
      if (legacy === "EN") {
        writeLangCookie("EN");
        setLangState("EN");
        router.refresh();
      }
    } catch {}
  }, [router]);

  const setLang = (next: Lang) => {
    setLangState(next);
    writeLangCookie(next);
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
