import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a Shopify money value using the locale of its currency (USD -> "$40.00",
// not "USD 40.00", which is what es-MX prints for dollars).
export function formatPrice(
  price: { amount: string; currencyCode: string },
  { stripZeros = false }: { stripZeros?: boolean } = {}
) {
  return new Intl.NumberFormat(price.currencyCode === "USD" ? "en-US" : "es-MX", {
    style: "currency",
    currency: price.currencyCode,
    ...(stripZeros && { trailingZeroDisplay: "stripIfInteger" as const }),
  }).format(parseFloat(price.amount));
}
