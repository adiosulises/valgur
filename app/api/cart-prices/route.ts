import { getVariantPrices } from "@/lib/shopify";
import { getCountry } from "@/lib/market";

export async function POST(req: Request) {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return Response.json({ prices: [] });

    const country = await getCountry();
    const prices = await getVariantPrices(ids, country);
    return Response.json({ prices });
}
