// NOTE: Vinyl ("Discos") logic lives in lib/vinyl.ts — article-derived products
// that pull live price/stock/images from Buen Dia Records (see getVinyls / fetchBuenDia).

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;


// Main Fetch
export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number;
}): Promise<{ status: number; body: T }> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken!,
      },
      body: JSON.stringify({ query, variables }),
      cache: revalidate !== undefined ? undefined : cache,
      next: revalidate !== undefined
        ? { revalidate }
        : cache === 'force-cache' ? { revalidate: 3600 } : undefined
    });

    return {
      status: result.status,
      body: await result.json()
    };
  } catch (error) {
    // Next.js throws this internally to bail a route out of static
    // rendering (e.g. cache: "no-store"); it's not a real API failure.
    const digest = (error as { digest?: string })?.digest;
    if (typeof digest === 'string' && digest.startsWith('DYNAMIC_SERVER_USAGE')) {
      throw error;
    }
    console.error('Error reaching Shopify Storefront API:', error);
    throw {
      error,
      query,
    };
  }
}

// PRODUCTS
//            Product Types
export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  collections?: {
    edges: {
      node: {
        title: string;
      };
    }[];
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        quantityAvailable: number;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
};
export type ShopifyProductVideo = {
  mediaContentType: 'VIDEO';
  sources: { url: string; mimeType: string; format: string }[];
  previewImage: { url: string } | null;
};
export type ShopifyProductExternalVideo = {
  mediaContentType: 'EXTERNAL_VIDEO';
  embeddedUrl: string;
  host: string;
  previewImage: { url: string } | null;
};
export type ShopifyProductMedia = ShopifyProductVideo | ShopifyProductExternalVideo;

//            Product Functions
export async function getProduct(handle: string) {
  return shopifyFetch<{ data: { product: ShopifyProduct } }>({
    query: `{
      product(handle: "${handle}") {
        id
        title
        handle
        description
        availableForSale
        tags
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }`
  });
}
export async function getProducts(cursor?: string) {
  const afterClause = cursor ? `, after: "${cursor}"` : "";

  return shopifyFetch<{
    data: {
      products: {
        pageInfo: { hasNextPage: boolean };
        edges: { cursor: string; node: ShopifyProduct }[];
      };
    };
  }>({
    query: `{
      products(first: 12${afterClause}) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            availableForSale
            tags
            images(first: 10) {
              edges {
                node { url altText }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            variants(first: 20) {
              edges {
                node {
                  id title availableForSale quantityAvailable
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }`,
    revalidate: 60
  });
}
export async function getProductsByTag(tag: string) {
  return shopifyFetch<{ data: { products: { edges: { node: ShopifyProduct }[] } } }>({
    query: `{
      products(first: 10, query: "tag:${tag}") {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            collections(first: 5) {
              edges {
                node {
                  title
                }
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }`,
    revalidate: 60
  });
}
export function productHasPriceRange(product: ShopifyProduct): boolean {
  const range = product.priceRange;
  return range.minVariantPrice.amount !== range.maxVariantPrice.amount;
}

// ARTICLES / BLOGS
//                  Article Types

//                  Article Functions
// ---- article types --------------------------------------------------------
export type ShopifyArticle = {
  handle?: string | null;
  blogHandle?: string | null;
  blogTitle?: string | null;
  title?: string | null;
  contentHtml?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
  image?: { url: string; altText: string | null } | null;
};

export async function getAllArticles(cache: RequestCache = 'force-cache'): Promise<ShopifyArticle[]> {
  const query = `
    query GetAllArticles {
      blogs(first: 20) {
        edges {
          node {
            handle
            title
            articles(first: 50) {
              edges {
                node {
                  handle
                  title
                  contentHtml
                  publishedAt
                  tags
                  authorV2 {
                    name
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<{
    data: {
      blogs: {
        edges: {
          node: {
            handle: string;
            title: string;
            articles: { edges: { node: any }[] }
          }
        }[]
      }
    }
  }>({ query, cache });

  const blogs = res.body.data?.blogs?.edges ?? [];
  return blogs.flatMap(blog =>
    blog.node.articles.edges.map((e: any) => ({ ...e.node, blogHandle: blog.node.handle, blogTitle: blog.node.title }))
  );
}
export async function getArticlesByTag(tag: string, count: number = 10, cache: RequestCache = 'force-cache'): Promise<ShopifyArticle[]> {
  const query = `
    query GetArticlesByTag($tag: String!, $count: Int!) {
      blogs(first: 20) {
        edges {
          node {
            handle
            articles(first: $count, query: $tag) {
              edges {
                node {
                  handle
                  title
                  contentHtml
                  publishedAt
                  tags
                  authorV2 {
                    name
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<{
    data: {
      blogs: {
        edges: {
          node: {
            handle: string;
            articles: {
              edges: { node: any }[]
            }
          }
        }[]
      }
    }
  }>({ query, variables: { tag: `tag:${tag}`, count }, cache });

  const blogs = res.body.data?.blogs?.edges ?? [];
  return blogs.flatMap(blog =>
    blog.node.articles.edges.map((e: any) => ({ ...e.node, blogHandle: blog.node.handle }))
  );
}
export async function getArticleByHandle(blogHandle: string, articleHandle: string, cache: RequestCache = 'force-cache') {
  const query = `
    query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        handle
        title
        articleByHandle(handle: $articleHandle) {
          handle
          title
          contentHtml
          publishedAt
          tags
          image {
            url
            altText
          }
        }
        articles(first: 50) {
          edges {
            node {
              handle
              title
              publishedAt
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;

  const res = await shopifyFetch<{
    data: {
      blog: {
        handle: string;
        title: string;
        articleByHandle: {
          handle: string;
          title: string;
          contentHtml: string;
          publishedAt: string;
          tags: string[];
          image: { url: string; altText: string | null } | null;
        } | null;
        articles: {
          edges: {
            node: {
              handle: string;
              title: string;
              publishedAt: string;
              image: { url: string; altText: string | null } | null;
            };
          }[];
        };
      } | null;
    };
  }>({ query, variables: { blogHandle, articleHandle }, cache });

  return res.body.data?.blog ?? null;
}
export async function getArticlesByBlogHandle(
  blogHandle: string,
  count: number = 50,
  cache: RequestCache = "force-cache"
): Promise<ShopifyArticle[]> {
  const query = `
    query GetArticlesByBlogHandle($blogHandle: String!, $count: Int!) {
      blog(handle: $blogHandle) {
        handle
        articles(first: $count) {
          edges {
            node { handle title contentHtml publishedAt tags image { url altText } }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<{
    data: { blog: { handle: string; articles: { edges: { node: any }[] } } | null };
  }>({ query, variables: { blogHandle, count }, cache });

  const blog = res.body.data?.blog;
  if (!blog) return [];
  return blog.articles.edges.map((e) => ({ ...e.node, blogHandle: blog.handle }));
}


// Others
export async function getAllPolicies() {
  const res = await shopifyFetch<{
    data: {
      shop: {
        privacyPolicy: { title: string; body: string } | null;
        refundPolicy: { title: string; body: string } | null;
        termsOfService: { title: string; body: string } | null;
        shippingPolicy: { title: string; body: string } | null;
      }
    }
  }>({
    query: `
      query getAllPolicies {
        shop {
          privacyPolicy {
            title
            body
          }
          refundPolicy {
            title
            body
          }
          termsOfService {
            title
            body
          }
          shippingPolicy {
            title
            body
          }
        }
      }
    `,
  });

  // Return an array of policies that actually exist and have content
  return Object.values(res.body.data.shop).filter((policy): policy is { title: string; body: string } =>
    policy !== null && policy.body.trim() !== ''
  );
}
