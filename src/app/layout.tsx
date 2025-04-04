import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/hoc/Navbar";
import AppLayout from "@/components/layouts/AppLayout";
import Providers from "@/utilies/Providers";
import NextTopLoader from "nextjs-toploader";
import GoogleScriptComponent from "@/components/atoms/GoogleScriptComponent";
import dynamic from "next/dynamic";
import HeadScripts from "@/components/atoms/HeadScripts";
import { PAGE_REVALIDATE_TIME_FOR_AUCTION_LIST } from "@/shared/Constants";
const Footer = dynamic(() => import("@/components/hoc/Footer"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Reduces layout shift
});

export const revalidate = PAGE_REVALIDATE_TIME_FOR_AUCTION_LIST;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <HeadScripts />
        </head>
        <body className={inter.className}>
          <Providers>
            <div className="flex flex-col h-screen">
              <NextTopLoader
                color="#000"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              />
              <Navbar />
              <AppLayout>{children}</AppLayout>
              <Footer />
            </div>
          </Providers>
          <GoogleScriptComponent />
        </body>
      </html>
    </>
  );
}
