import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { ReactLenis } from "@/lib/lenis";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Russel & Larshanay | Wedding",
  description: "Russel & Larshanay Wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactLenis root>
        <body
          className={`${playfair.variable} antialiased min-h-screen flex flex-col`}
        >
          <Toaster />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </ReactLenis>
    </html>
  );
}
