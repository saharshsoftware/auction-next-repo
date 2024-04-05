import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/hoc/Footer";
import Navbar from "@/components/hoc/Navbar";
import AppLayout from "@/components/layouts/AppLayout";
import Providers from "@/utilies/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Auction Deals",
    template: "%s - Auction Deals",
  },
  description: "Trending Auction Deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen">
            <Navbar />
            <AppLayout>{children}</AppLayout>
            <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}
