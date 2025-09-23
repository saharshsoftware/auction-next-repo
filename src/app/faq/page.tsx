import FaqPage  from '@/components/templates/FaqPage';
import FaqJsonLd from '@/components/atoms/FaqJsonLd';
import { getFaqData } from '@/server/actions/footer';
import { DEFAULT_FAQ_DATA } from '@/shared/Constants';
import { Metadata } from 'next';

export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "Property Auction FAQs | Expert Tips by e-auctiondekho",
  description:
    "Get expert answers to property auction FAQs – EMD, SARFAESI, loans, registration, dues, and more. Trusted buyer guidance from e-auctiondekho.",
  keywords: [
    "bank auction properties",
    "auction properties",
    "residential auctions",
    "commercial auctions",
    "vehicle auctions",
    "gold auctions",
    "bank repossessed properties",
    "SBI property auctions",
    "ICICI property auctions",
    "HDFC auction properties",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    title:
      "Property Auction FAQs | Expert Tips by e-auctiondekho",
    description:
      "Get expert answers to property auction FAQs – EMD, SARFAESI, loans, registration, dues, and more. Trusted buyer guidance from e-auctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    card: "summary_large_image",
    title:
      "Property Auction FAQs | Expert Tips by e-auctiondekho",
    description:
      "Find the best deals at eauctiondekho with auctions across India for vehicles, residential flats, commercial shops, industrial plots, machinery, and gold. Your one-stop shop for bank-auctioned assets.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
      },
    ],
  },
};


export default async function Page() {
  const res = await getFaqData();
  const faqData = res || []
  
  const faqJsonData = DEFAULT_FAQ_DATA.map((item: any) => ({
    question: item.question,
    answer: item.answer
  }));

  return (
    <>
      <FaqJsonLd faqItems={faqJsonData} />
      <FaqPage
        faqData={faqData}
      />
    </>
  );
};