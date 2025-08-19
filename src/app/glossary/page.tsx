'use client'
import React, { useState } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { ROUTE_CONSTANTS } from '@/shared/Routes';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Reserve Price",
    definition: "The minimum price set by the seller below which the property will not be sold. This is the starting point for bidding in an auction.",
    category: "Pricing"
  },
  {
    term: "EMD (Earnest Money Deposit)",
    definition: "A refundable security deposit that bidders must pay to participate in the auction. It demonstrates serious intent to purchase and is typically 5-10% of the reserve price.",
    category: "Payments"
  },
  {
    term: "Increment Price",
    definition: "The minimum amount by which each bid must increase from the previous bid. This ensures orderly bidding and prevents minimal increases.",
    category: "Bidding"
  },
  {
    term: "Auction Notice",
    definition: "An official document published by the bank containing all details about the property, auction terms, conditions, and legal information.",
    category: "Documentation"
  },
  {
    term: "Property Inspection",
    definition: "A scheduled period when potential bidders can physically visit and examine the property before the auction date.",
    category: "Process"
  },
  {
    term: "Authorized Officer",
    definition: "A bank official who is legally authorized to conduct the auction and make decisions on behalf of the lending institution.",
    category: "Personnel"
  },
  {
    term: "Borrower",
    definition: "The original owner of the property who took a loan against it and defaulted on payments, leading to the auction.",
    category: "Legal"
  },
  {
    term: "Asset Category",
    definition: "Classification of the property type such as Residential, Commercial, Industrial, or Agricultural land.",
    category: "Property Types"
  },
  {
    term: "Title Deed",
    definition: "Legal document that proves ownership of the property. Types include Sale Deed, Lease Deed, or Gift Deed.",
    category: "Legal"
  },
  {
    term: "Possession Type",
    definition: "Indicates whether the property possession is Physical (vacant) or Symbolic (occupied by borrower/tenant).",
    category: "Legal"
  },
  {
    term: "Freehold Property",
    definition: "Property where you own both the land and the building permanently without any time limit.",
    category: "Ownership"
  },
  {
    term: "Leasehold Property",
    definition: "Property where you own the building but the land is leased for a specific period (usually 99 years).",
    category: "Ownership"
  },
  {
    term: "Service Provider",
    definition: "Third-party platforms like BankNet, IBAPI, or Bank E-Auctions that facilitate online auction processes for banks.",
    category: "Technology"
  },
  {
    term: "Bid Submission",
    definition: "The process of placing your offer amount during the live auction within the specified time frame.",
    category: "Bidding"
  },
  {
    term: "Highest Bidder",
    definition: "The participant who places the highest valid bid above the reserve price when the auction closes.",
    category: "Bidding"
  },
  {
    term: "Sale Certificate",
    definition: "Official document issued to the successful bidder confirming the purchase and transfer of property ownership.",
    category: "Documentation"
  },
  {
    term: "Encumbrance",
    definition: "Any legal claims, liens, or restrictions on the property that may affect its ownership or transfer.",
    category: "Legal"
  },
  {
    term: "Market Value",
    definition: "The estimated current market price of the property based on location, condition, and comparable sales.",
    category: "Pricing"
  }
];

const categories = Array.from(new Set(glossaryTerms.map(term => term.category))).sort();

const GlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTerm = (term: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);
    }
    setExpandedTerms(newExpanded);
  };

  return (
    <>
      <div className="common-section py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Glossary</h1>
          </div>
          <p className="text-sm-xs mx-auto">
            Understanding key terms and concepts in property auctions to help you make informed decisions.
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
                placeholder="Search terms or definitions..."
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
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm-xs">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </p>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-4">
          {filteredTerms.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleTerm(item.term)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm-xs font-semibold text-gray-900">{item.term}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {expandedTerms.has(item.term) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedTerms.has(item.term) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-sm-xs leading-relaxed pt-4">{item.definition}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm-xs font-medium text-gray-900 mb-2">No terms found</h3>
            <p className="text-sm-xs">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-sm-xs font-semibold text-blue-900 mb-2">Need More Help?</h3>
          <p className="text-blue-800 mb-4 text-sm-xs">
            Can&apos;t find the term you&apos;re looking for? Our support team is here to help you understand any auction-related concepts.
          </p>
          <Link
            href={ROUTE_CONSTANTS.CONTACT}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </>
  );
};

export default GlossaryPage;
