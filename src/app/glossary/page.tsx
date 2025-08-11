"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";

interface IGlossaryItem {
  term: string;
  acronym?: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

const glossaryData: IGlossaryItem[] = [
  {
    term: "EMD",
    acronym: "Earnest Money Deposit",
    definition: "A security deposit required to participate in an auction. It demonstrates your serious intent to bid and is typically a percentage of the property's value.",
    example: "For a property worth ₹1 crore, the EMD might be ₹5-10 lakhs (5-10% of the property value).",
    relatedTerms: ["Reserve Price", "Auction", "Bidding", "EMD Submission"]
  },
  {
    term: "EMD Submission",
    definition: "The deadline by which you must submit your Earnest Money Deposit to participate in the auction. This is typically the same as the auction end date and is a critical deadline that cannot be extended.",
    example: "If the EMD submission deadline is September 25th at 5:00 PM, you must complete the payment and submit all required documents before this time to be eligible to bid.",
    relatedTerms: ["EMD", "Auction End Date", "Bidding", "Deadline"]
  },
  {
    term: "Reserve Price",
    definition: "The minimum price at which the property will be sold. Bids below this amount will not be accepted, even if they are the highest bid.",
    example: "If the reserve price is ₹50 lakhs, the property will only be sold if someone bids ₹50 lakhs or higher.",
    relatedTerms: ["EMD", "Bidding", "Auction"]
  },
  {
    term: "Auction",
    definition: "A public sale where goods or property are sold to the highest bidder. In property auctions, bidders compete by offering increasingly higher prices.",
    example: "Bank auctions, government auctions, and foreclosure auctions are common types of property auctions.",
    relatedTerms: ["EMD", "Reserve Price", "Bidding", "Auction End Date", "EMD Submission"]
  },
  {
    term: "Bidding",
    definition: "The process of making offers to purchase a property during an auction. Bidders compete by offering higher amounts than other participants.",
    example: "Bidding starts at the reserve price and continues until no one offers a higher amount.",
    relatedTerms: ["Auction", "EMD", "Reserve Price"]
  },
  {
    term: "Auction End Date",
    definition: "The final date and time when the auction closes. All EMD submissions and final bids must be completed before this deadline.",
    example: "If the auction ends on September 25th at 5:00 PM, you must submit your EMD and final bid before that time.",
    relatedTerms: ["EMD", "Auction", "Bidding", "EMD Submission"]
  },
  {
    term: "Service Provider",
    definition: "The platform or service that conducts the auction on behalf of the bank or property owner. They handle the technical aspects of the auction process.",
    example: "Companies like auctiontiger.com, bankbazaar.com, or bank-specific platforms.",
    relatedTerms: ["Auction", "Bank", "Platform"]
  },
  {
    term: "Property Type",
    definition: "The category or classification of the property being auctioned, such as residential, commercial, industrial, or agricultural.",
    example: "Residential properties include houses, apartments, and plots. Commercial properties include shops, offices, and warehouses.",
    relatedTerms: ["Area", "City", "Property"]
  },
  {
    term: "Area",
    definition: "The physical location or region where the property is situated. This can include the neighborhood, district, or specific area within a city.",
    example: "Jodhpur area in Ahmedabad, Gujarat refers to a specific neighborhood within the city.",
    relatedTerms: ["City", "Property Type", "Location"]
  }
];

const GlossaryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [highlightedTerm, setHighlightedTerm] = React.useState<string>("");
  
  const termRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle URL parameter for direct term navigation
  useEffect(() => {
    const termFromUrl = searchParams.get('term');
    if (termFromUrl) {
      setSearchTerm(termFromUrl);
      setHighlightedTerm(termFromUrl);
      
      // Scroll to the term after a short delay to ensure the page is rendered
      setTimeout(() => {
        const termRef = termRefs.current[termFromUrl];
        if (termRef) {
          termRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight effect
          termRef.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
          setTimeout(() => {
            termRef.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
          }, 3000);
        }
      }, 100);
    }
  }, [searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  const filteredGlossary = glossaryData.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.acronym?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    
    // Simple categorization logic
    if (selectedCategory === "financial" && (item.term === "EMD" || item.term === "Reserve Price")) return matchesSearch;
    if (selectedCategory === "process" && (item.term === "Auction" || item.term === "Bidding" || item.term === "Auction End Date" || item.term === "EMD Submission")) return matchesSearch;
    if (selectedCategory === "property" && (item.term === "Property Type" || item.term === "Area")) return matchesSearch;
    
    return matchesSearch;
  });

  const categories = [
    { key: "all", label: "All Terms", count: glossaryData.length },
    { key: "financial", label: "Financial Terms", count: 2 },
    { key: "process", label: "Auction Process", count: 4 },
    { key: "property", label: "Property Details", count: 2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackClick}
            className="rounded-full bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Auction Glossary & FAQ</h1>
            <p className="text-gray-600 mt-2">Understand key terms and concepts related to property auctions</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search for terms, acronyms, or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Glossary Content */}
        <div className="space-y-6">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No terms found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            filteredGlossary.map((item, index) => (
              <div 
                key={index} 
                ref={(el) => { termRefs.current[item.term] = el; }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {item.term}
                      {item.acronym && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({item.acronym})
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{item.definition}</p>
                
                {item.example && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <p className="text-sm font-medium text-blue-800 mb-1">Example:</p>
                    <p className="text-blue-700">{item.example}</p>
                  </div>
                )}
                
                {item.relatedTerms && item.relatedTerms.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Related terms:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedTerms.map((term, termIndex) => (
                        <span
                          key={termIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                          onClick={() => setSearchTerm(term)}
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How much EMD do I need to pay?</h3>
              <p className="text-gray-700">EMD typically ranges from 5% to 10% of the property&apos;s reserve price. The exact amount is specified in the auction notice. For example, if a property has a reserve price of ₹1 crore, you might need to pay ₹5-10 lakhs as EMD.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is EMD refundable?</h3>
              <p className="text-gray-700">Yes, EMD is refundable if you don&apos;t win the auction. However, if you win and then fail to complete the purchase, the EMD may be forfeited. Always read the auction terms carefully.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What is the EMD Submission deadline?</h3>
              <p className="text-gray-700">The EMD Submission deadline is the final date and time by which you must submit your Earnest Money Deposit to participate in the auction. This deadline is typically the same as the auction end date and is critical - missing it means you cannot participate in the auction.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if no one bids above the reserve price?</h3>
              <p className="text-gray-700">If no one bids above the reserve price, the auction is considered unsuccessful and the property is not sold. The bank may re-auction the property later, possibly with a lower reserve price.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I participate in multiple auctions simultaneously?</h3>
              <p className="text-gray-700">Yes, you can participate in multiple auctions, but you&apos;ll need to pay EMD for each one separately. Make sure you have sufficient funds to cover all EMD requirements.</p>
            </div>
            
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What documents do I need for auction participation?</h3>
              <p className="text-gray-700">Typically, you&apos;ll need identity proof, address proof, PAN card, and the EMD amount. Some auctions may require additional documents like income proof or bank statements. Check the specific auction notice for requirements.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Still have questions?</h2>
          <p className="text-blue-700 mb-6">Our team is here to help you understand the auction process better.</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;
