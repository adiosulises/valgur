import { getCountry } from "@/lib/market";

const MAX_LINES = 50;
const MAX_QUANTITY = 99;

type Line = { id: string; quantity: number };

function parseItems(body: unknown): Line[] | null {
    const items = (body as { items?: unknown } | null)?.items;
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) return null;
    for (const i of items) {
        if (
            !i ||
            typeof i.id !== "string" ||
            !i.id.startsWith("gid://shopify/ProductVariant/") ||
            !Number.isInteger(i.quantity) ||
            i.quantity < 1 ||
            i.quantity > MAX_QUANTITY
        ) return null;
    }
    return items;
}

export async function POST(req: Request) {
    const items = parseItems(await req.json().catch(() => null));
    if (!items) return Response.json({ error: "invalid cart" }, { status: 400 });

    try {
        const country = await getCountry();
        const lines = items.map((i) => ({ merchandiseId: i.id, quantity: i.quantity }));
        const res = await fetch(
            `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify({
                    query: `mutation cartCreate($input: CartInput!, $country: CountryCode!) @inContext(country: $country) {
                        cartCreate(input: $input) {
                            cart { checkoutUrl }
                            userErrors { field message }
                        }
                    }`,
                    // Same market the shopper browsed in, so checkout charges the
                    // prices/currency they saw instead of the store default.
                    variables: { input: { lines, buyerIdentity: { countryCode: country } }, country },
                }),
            }
        );

        const json = await res.json();
        const url = json.data?.cartCreate?.cart?.checkoutUrl;
        if (!url) return Response.json({ error: "checkout failed" }, { status: 502 });
        return Response.json({ url });
    } catch {
        return Response.json({ error: "checkout failed" }, { status: 502 });
    }
}
