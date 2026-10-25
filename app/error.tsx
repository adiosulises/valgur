"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-[8%] py-16 text-center">
      <h1 className="font-bold text-3xl md:text-5xl leading-none">{t("errors.errorTitle")}</h1>
      <p className="max-w-md">{t("errors.errorBody")}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={reset}
          className="border bg-[#FF0084] text-white px-6 py-3 font-bold italic text-[20px] leading-none uppercase cursor-pointer hover:opacity-90 transition-opacity"
        >
          {t("errors.retry")}
        </button>
        <Link href="/" className="border border-[#FF0084] text-[#FF0084] px-6 py-3 font-bold italic text-[20px] leading-none uppercase hover:opacity-90 transition-opacity">
          {t("errors.backHome")}
        </Link>
      </div>
    </div>
  );
}
