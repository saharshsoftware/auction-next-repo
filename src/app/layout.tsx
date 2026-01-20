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
import { CACHE_TIMES } from "@/shared/Constants";
import ConfettiCelebration from "@/components/atoms/ConfettiCelebration";
import BrokerPartnerPrompt from "@/components/atoms/BrokerPartnerPrompt";
const Footer = dynamic(() => import("@/components/hoc/Footer"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Reduces layout shift
});

export const revalidate = CACHE_TIMES.AUCTION_LIST;

/**
 * Check if the current environment should prevent indexing
 * 
 * CHANGE: Added environment-based detection to prevent staging from being indexed.
 * 
 * Detection priority:
 * 1. NEXT_PUBLIC_ENVIRONMENT=staging (most reliable - set in staging env)
 * 2. Domain URL contains "staging" (fallback for backward compatibility)
 * 3. Default: Allow indexing (production)
 * 
 * @returns true if staging environment is detected (prevents indexing)
 */
function shouldPreventIndexing(): boolean {
  // Check explicit environment variable first (most reliable)
  // Set NEXT_PUBLIC_ENVIRONMENT=staging in your staging environment
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
  if (environment === "staging") {
    return true;
  }
  
  // Fallback: Check if domain URL contains "staging" (backward compatibility)
  // This allows detection even if NEXT_PUBLIC_ENVIRONMENT is not set
  const domainBaseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "";
  if (domainBaseUrl.toLowerCase().includes("staging")) {
    return true;
  }
  
  // Default: Allow indexing (production)
  return false;
}

/**
 * Root layout metadata - applies to ALL pages in the application
 * 
 * CHANGE: Added conditional robots metadata to prevent staging indexing.
 * This metadata is inherited by all pages unless they explicitly override it.
 * 
 * How it works:
 * - All pages inherit this robots directive from the root layout
 * - Individual pages can still override with their own robots metadata if needed
 * - Staging: Sets "noindex, nofollow" for all pages
 * - Production: Sets "index, follow" (allows indexing)
 * 
 * Note: This works together with robots.txt and X-Robots-Tag headers for
 * comprehensive protection. Even if a page overrides this, the HTTP headers
 * and robots.txt will still prevent indexing on staging.
 */
export const metadata: Metadata = {
  // Ensures all relative URLs in metadata resolve to the primary domain
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.eauctiondekho.com"
  ),
  // CHANGE: Prevent indexing on staging environment
  // This applies to ALL pages unless they explicitly override it
  robots: shouldPreventIndexing() ? "noindex, nofollow" : "index, follow",
};

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
            <>
              <div className="flex flex-col h-screen">
                <ConfettiCelebration />
                <BrokerPartnerPrompt />
                <NextTopLoader
                  color="#5356FF"
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
            </>
          </Providers>
          <GoogleScriptComponent />
        </body>
      </html>
    </>
  );
}
