import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Gémina bsas | Talles Reales Plus Size",
  description: "Ropa moderna, cómoda y con estilo diseñada pensando en vos. Talles reales que celebran tu cuerpo.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        <CartProvider>
          <AuthProvider>
            {children}
            <WhatsAppButton />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
