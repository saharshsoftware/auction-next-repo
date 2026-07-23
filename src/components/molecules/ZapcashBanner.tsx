import Image from "next/image";

const ZAPCASH_APPLY_URL = "https://zapcash.in/personal-loan";

export default function ZapcashBanner() {
  return (
    <section className="common-section" aria-label="ZapCash personal loan">
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white md:rounded-[32px] border border-gray-200">
        <Image
          src="/images/banners/zapcash-auction-banner.png"
          alt="ZapCash personal loan offer: get up to ₹1,00,000 with a digital application and fast bank disbursal"
          width={1428}
          height={500}
          // sizes="(min-width: 1280px) calc(100vw - 16rem), calc(100vw - 2rem)"
          className="block h-auto w-full rounded-2xl md:rounded-[32px]"
        />

        <a
          href={ZAPCASH_APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apply for a ZapCash personal loan (opens in a new tab)"
          className="absolute left-[4.06%] top-[68%] h-[14.4%] w-[19.89%] rounded-[8px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="sr-only">Apply Now</span>
        </a>
      </div>
    </section>
  );
}
