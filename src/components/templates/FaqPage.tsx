'use client'
import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import Link from 'next/link';
import { renderMarkdown } from '@/shared/Utilies';

export interface FAQItem {
  question: string;
  answer: string;
  tags: string;
}


interface IFaqPage {
  faqData: FAQItem[];
}

const FaqPage: React.FC<IFaqPage> = (props: IFaqPage) => {
  const { faqData } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
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
                className="w-full px-6 py-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="text-sm-xs font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm-xs font-medium rounded-full">
                          {faq.tags}
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
                  {/* <p className="text-sm-xs leading-relaxed pt-4">{faq.answer}</p> */}
                  <div
              className="text-left text-base leading-[30px] font-normal relative self-stretch danger-blog-class"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(faq.answer ?? ""),
              }}
            ></div>
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

export default FaqPage;