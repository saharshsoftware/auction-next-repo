import React, { type ReactElement } from "react";

/**
 * FaqJsonLd renders a JSON-LD FAQPage for the current page.
 * Provide an array of FAQ items with questions and answers.
 */
interface IFaqItem {
  question: string;
  answer: string;
}

interface IFaqJsonLdProps {
  faqItems: readonly IFaqItem[];
}

const FaqJsonLd = ({ faqItems }: IFaqJsonLdProps): ReactElement => {
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faqItem: IFaqItem) => ({
      "@type": "Question",
      name: faqItem.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqItem.answer,
      },
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
    />
  );
};

export default FaqJsonLd;
