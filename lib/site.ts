// Single place for the site's public identity, used by metadata, sitemap, robots and JSON-LD.
// www is the canonical host: the apex valgur.mx redirects to it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.valgur.mx").replace(/\/$/, "");
export const SITE_NAME = "Valgur";
export const INSTAGRAM_URL = "https://www.instagram.com/soyvalgur/";

type Lang = "ES" | "EN";

export const SITE_DESCRIPTION: Record<Lang, string> = {
  ES: "Valgur es un dúo pop musical y performático de los hermanos Valdivieso Gurrión. Escucha su música, descubre sus próximos shows y compra su merch, CDs y vinilos.",
  EN: "Valgur is a pop music and performance duo formed by the Valdivieso Gurrión brothers. Listen to their music, find upcoming shows, and shop merch, CDs and vinyl.",
};

// Short brand line used for og:description / twitter:description (link previews).
export const OG_DESCRIPTION: Record<Lang, string> = {
  ES: "Dúo pop musical y performático conformado por los hermanos Valdivieso Gurrión",
  EN: "A pop musical and performance duo formed by the Valdivieso Gurrión brothers",
};

export const PAGE_META: Record<"shows" | "tienda" | "bio", Record<Lang, { title: string; description: string }>> = {
  shows: {
    ES: {
      title: "Shows",
      description: "Próximas fechas y conciertos de Valgur. Consulta boletos, lugares y contacto para contratar al dúo.",
    },
    EN: {
      title: "Shows",
      description: "Upcoming Valgur tour dates and concerts. Find tickets, venues and booking contacts.",
    },
  },
  tienda: {
    ES: {
      title: "Tienda",
      description: "Tienda oficial de Valgur: ropa, CDs y vinilos del dúo pop. Envíos desde México.",
    },
    EN: {
      title: "Shop",
      description: "Official Valgur store: clothing, CDs and vinyl from the pop duo.",
    },
  },
  bio: {
    ES: {
      title: "Bio",
      description: "Valgur es un dúo pop musical y performático conformado por los hermanos Valdivieso Gurrión. Contacto y booking.",
    },
    EN: {
      title: "Bio",
      description: "Valgur is a pop musical and performance duo formed by the Valdivieso Gurrión brothers. Contact and booking.",
    },
  },
};

export const KEYWORDS = [
  "Valgur",
  "Valgur música",
  "dúo pop",
  "hermanos Valdivieso Gurrión",
  "pop mexicano",
  "merch Valgur",
  "vinilos",
  "shows",
];
