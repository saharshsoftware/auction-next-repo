import Image from "next/image";

const ZAPCASH_APPLY_URL = "https://zapcash.in?source=DSA_MRXHZWWI_9Q06OJ";
const LOAN_AMOUNT = "₹1,00,000";

type ZapcashPromoProps = {
  context?: "search" | "list" | "detail";
  className?: string;
};

const promoCopy = {
  search: {
    title: "Need extra funds for your auction purchase?",
    description: "Explore a quick personal loan of up to ₹1,00,000 with ZapCash.",
  },
  list: {
    title: "Need extra funds for an auction opportunity?",
    description: "Explore a quick personal loan of up to ₹1,00,000 with ZapCash.",
  },
  detail: {
    title: "Interested in this auction? Plan your funds early.",
    description: "Explore a quick personal loan of up to ₹1,00,000 with ZapCash.",
  },
};

export default function ZapcashPromo({
  context = "search",
  className = "",
}: ZapcashPromoProps) {
  const copy = promoCopy[context];
  const [descriptionBeforeAmount, descriptionAfterAmount] =
    copy.description.split(LOAN_AMOUNT);

  return (
    <aside
      aria-label="ZapCash personal loan"
      className={`flex flex-col gap-3 rounded-xl border border-[#b8dfc9] bg-[#f0faf4] px-4 py-3 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src="/images/zapcash-mark.svg"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#005b32]">{copy.title}</p>
          <p className="mt-0.5 text-xs leading-5 text-gray-600 sm:text-sm">
            {descriptionBeforeAmount}
            <strong className="font-bold text-[#005b32]">{LOAN_AMOUNT}</strong>
            {descriptionAfterAmount}
          </p>
        </div>
      </div>
      <a
        href={ZAPCASH_APPLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[#007a3d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005f30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007a3d] sm:w-auto"
        aria-label="Explore a personal loan with ZapCash (opens in a new tab)"
      >
        Explore ZapCash
      </a>
    </aside>
  );
}
