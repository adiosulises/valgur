"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type Doc = { title: string; body: string } | null;

export function FooterDrawer({ atencion, privacidad }: { atencion: Doc; privacidad: Doc }) {
  const { t } = useLocale();
  const [active, setActive] = useState<"atencion" | "privacidad" | null>(null);
  const doc = active === "atencion" ? atencion : active === "privacidad" ? privacidad : null;
  const close = () => setActive(null);

  return (
    <>
      <button type="button" onClick={() => setActive("atencion")} className="text-sm font-medium cursor-pointer">
        {t("footer.customerService")}
      </button>
      <button type="button" onClick={() => setActive("privacidad")} className="text-sm font-medium cursor-pointer">
        {t("footer.privacyPolicy")}
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/50 transition-[opacity,display] transition-discrete duration-300 starting:opacity-0 ${
          active ? "opacity-100" : "opacity-0 hidden"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white flex flex-col transform transition-transform duration-300 ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center gap-4 mb-4">
            <h2 className="font-bold uppercase">{doc?.title ?? ""}</h2>
            <button type="button" onClick={close} aria-label={t("footer.close")} className="cursor-pointer shrink-0">
              {t("footer.closeGlyph")}
            </button>
          </div>
          {doc ? (
            <div
              className="text-sm [&_p]:mb-4 [&_a]:text-[#0000EE] [&_a]:underline [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />
          ) : (
            <p className="opacity-60">{t("footer.contentUnavailable")}</p>
          )}
        </div>
      </aside>
    </>
  );
}
