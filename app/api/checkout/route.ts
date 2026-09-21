import { getCountry } from "@/lib/market";

export async function POST(req: Request) {

    const { items } = await req.json();
    const country = await getCountry();
    const lines = items.map((i: {id: string, quantity: number}) => ({
        merchandiseId: i.id,
        quantity: i.quantity,
    }));
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
    if (!url) return Response.json({ error: "checkout failed" }, { status: 500 });
    return Response.json({ url });
}
