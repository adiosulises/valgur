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

export const metadata: Metadata = {
  title: "Valgur",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={barlow.variable}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Valgur" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <LoadingScreen />
        <TopProgress />
        <CursorTrail />
        <LocaleProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
