import { Plus_Jakarta_Sans, Philosopher, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { headers } from "next/headers";
import { fetchCatalog } from "@/lib/api";
import { CartProvider } from "./context/CartContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Bhayeli",
  description: "Bhayeli — Handcrafted Textiles from Rural Rajasthan",
  icons: {
    icon: [{ url: "/image/logo.png", type: "image/png" }],
    apple: [{ url: "/image/logo.png", type: "image/png" }],
    shortcut: "/image/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  // Single API call for the whole app — categories + products fetched once
  const catalog = isAdmin ? { categories: [], products: [] } : await fetchCatalog();

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${philosopher.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <CartProvider>
          {!isAdmin && <Header categories={catalog.categories} />}
          {!isAdmin && (
            <script
              id="__BHAYELI_CATALOG__"
              type="application/json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(catalog) }}
            />
          )}
          {children}
          {!isAdmin && <Footer />}
        </CartProvider>
      </body>
    </html>
  );
}
