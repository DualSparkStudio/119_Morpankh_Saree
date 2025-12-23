import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Morpankh Saree - Premium Indian Fashion",
  description: "Discover premium quality sarees at Morpankh Saree. Elegant, luxurious, and timeless Indian fashion.",
  keywords: "saree, indian fashion, premium sarees, designer sarees, morpankh saree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        <Providers>
          <SmoothScroll>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
