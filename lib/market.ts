import { cookies } from "next/headers";
import type { Country } from "@/lib/shopify";

// Maps the "lang" cookie (set by LocaleContext on language switch) to the
// Shopify Markets country context, so prices/currency follow the language.
export async function getCountry(): Promise<Country> {
  const lang = (await cookies()).get("lang")?.value;
  return lang === "EN" ? "US" : "MX";
}
