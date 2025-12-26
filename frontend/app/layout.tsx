import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${cormorant.variable} ${poppins.variable} ${dancingScript.variable} font-sans antialiased`}
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
