'use client'
import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I participate in a property auction?",
    answer: "To participate in a property auction, you need to: 1) Register on the auction platform, 2) Pay the Earnest Money Deposit (EMD), 3) Submit required documents, 4) Attend the property inspection (if needed), and 5) Place your bids during the live auction.",
    category: "Getting Started"
  },
  {
    question: "What is Earnest Money Deposit (EMD) and is it refundable?",
    answer: "EMD is a security deposit (typically 5-10% of reserve price) that shows your serious intent to purchase. It's fully refundable if you don't win the auction or if the auction is cancelled. However, if you win and fail to complete the purchase, the EMD may be forfeited.",
    category: "Payments"
  },
  {
    question: "What happens if I win the auction?",
    answer: "If you're the highest bidder: 1) You'll receive a confirmation, 2) Pay the remaining amount (usually within 15-30 days), 3) Complete legal formalities, 4) Receive the sale certificate, and 5) Get possession of the property as per the terms.",
    category: "Winning Process"
  },
  {
    question: "Can I inspect the property before bidding?",
    answer: "Yes, banks typically schedule property inspection dates before the auction. You can visit the property during these specified times to assess its condition. Some properties may have restricted access if they're occupied.",
    category: "Property Inspection"
  },
  {
    question: "What documents do I need to participate?",
    answer: "Required documents typically include: Valid ID proof (Aadhaar/PAN), Address proof, Bank statements, Income proof, EMD payment receipt, and a signed undertaking. Specific requirements may vary by bank and property value.",
    category: "Documentation"
  },
  {
    question: "Are there any hidden costs in property auctions?",
    answer: "Apart from the bid amount, you may need to pay: Registration charges, stamp duty, legal fees, property transfer costs, and any pending dues like property tax or maintenance charges. Always factor these into your budget.",
    category: "Costs"
  },
  {
    question: "What if the property has legal issues or encumbrances?",
    answer: "Banks are required to disclose known legal issues in the auction notice. However, you should conduct your own due diligence. Properties are typically sold 'as is where is' basis, so any legal complications become the buyer's responsibility.",
    category: "Legal Issues"
  },
  {
    question: "Can I get a loan to buy an auction property?",
    answer: "Yes, you can apply for a home loan to purchase auction properties. However, loan approval depends on the property's legal status, your eligibility, and the lender's policies. It's advisable to get pre-approval before bidding.",
    category: "Financing"
  },
  {
    question: "What is the difference between reserve price and market value?",
    answer: "Reserve price is the minimum amount set by the bank below which they won't sell. Market value is the estimated current worth based on location and condition. Reserve price is often lower than market value, creating potential bargains.",
    category: "Pricing"
  },
  {
    question: "How long does the entire process take?",
    answer: "From auction announcement to possession, the process typically takes 2-4 months. This includes: Auction notice period (30 days), auction day, payment period (15-30 days), and legal formalities (30-60 days).",
    category: "Timeline"
  },
  {
    question: "Can I cancel my bid after placing it?",
    answer: "No, bids are binding and cannot be cancelled once placed during the live auction. Make sure you're certain about your bid amount and have arranged financing before participating.",
    category: "Bidding Rules"
  },
  {
    question: "What happens if no one bids above the reserve price?",
    answer: "If no valid bids are received above the reserve price, the auction is considered unsuccessful. The bank may re-auction the property at a later date, possibly with a revised reserve price.",
    category: "Auction Outcomes"
  },
  {
    question: "Are auction properties always cheaper than market rates?",
    answer: "Not always. While many auction properties sell below market value, competitive bidding can drive prices up. Popular locations and well-maintained properties may sell at or near market rates.",
    category: "Pricing"
  },
  {
    question: "Can I bid online or do I need to be physically present?",
    answer: "Most modern auctions are conducted online through platforms like BankNet, IBAPI, or Bank E-Auctions. You can participate from anywhere with internet access. Physical presence is rarely required.",
    category: "Auction Process"
  },
  {
    question: "What if I face technical issues during online bidding?",
    answer: "Contact the auction platform's technical support immediately. Most platforms have dedicated helplines during auction hours. It's advisable to test your internet connection and have backup options ready.",
    category: "Technical Support"
  }
];

const categories = Array.from(new Set(faqData.map(faq => faq.category))).sort();

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      <div className="common-section py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-sm-xs">
            Find answers to common questions about property auctions, bidding process, and legal requirements.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions and answers..."
                className="text-sm-xs w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="All" className='text-sm-xs'>All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className='text-sm-xs'>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm-xs">
            Showing {filteredFAQs.length} of {faqData.length} questions
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="text-sm-xs font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm-xs font-medium rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </div>
              </button>
              
              {expandedItems.has(index) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-sm-xs leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm-xs font-medium mb-2">No questions found</h3>
            <p className="text-sm-xs">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <MessageCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm-xs font-semibold text-blue-900 mb-2">Still have questions?</h3>
              <p className="text-blue-800 mb-4 text-sm-xs">
                Our support team is available to help you with any specific questions about property auctions, 
                bidding process, or technical issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={ROUTE_CONSTANTS.CONTACT}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm-xs font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;