import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TopProgress } from "@/components/TopProgress";
import { CursorTrail } from "@/components/CursorTrail";
import { getLang } from "@/lib/market";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_DESCRIPTION, KEYWORDS, INSTAGRAM_URL } from "@/lib/site";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

// Open-source DIN-style webfont; the CSS font stack tries real DIN / Bahnschrift first.
const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

// viewport-fit=cover lets the page (and the navbar's white background) extend under the iPhone
// notch / Dynamic Island; theme-color tints the status bar area to match.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const description = SITE_DESCRIPTION[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} — ${lang === "ES" ? "Dúo pop" : "Pop duo"}`, template: `%s | ${SITE_NAME}` },
    description,
    keywords: KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: OG_DESCRIPTION[lang],
      url: "/",
      locale: lang === "ES" ? "es_MX" : "en_US",
    },
    twitter: { card: "summary_large_image", title: SITE_NAME, description: OG_DESCRIPTION[lang] },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/#band`,
      name: SITE_NAME,
      url: SITE_URL,
      genre: "Pop",
      image: `${SITE_URL}/opengraph-image`,
      sameAs: [INSTAGRAM_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#band` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  const skip = (lang === "ES" ? es : en).a11y.skipToContent;
  return (
    <html lang={lang === "ES" ? "es" : "en"} className={barlow.variable}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Valgur" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a href="#main" className="skip-link">{skip}</a>
        <LoadingScreen />
        <TopProgress />
        <CursorTrail />
        <LocaleProvider>
          <CartProvider>
            <Navbar />
            <main id="main" tabIndex={-1} className="flex-grow flex flex-col outline-none">{children}</main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
