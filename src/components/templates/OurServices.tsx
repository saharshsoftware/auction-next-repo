'use client'
import React, { useEffect } from 'react';
import { Search, TrendingUp, Shield, Users, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { ROUTE_CONSTANTS } from '@/shared/Routes';

export const OurServices: React.FC = () => {

  // Handle initial scroll when component mounts with hash in URL
  const handleInitialScroll = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  useEffect(() => {
    handleInitialScroll();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Services
              <span className="block text-blue-200">Complete Auction Support</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              From property verification to loan assistance, we provide end-to-end support
              for your property auction journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                prefetch
                href={`${ROUTE_CONSTANTS.AUCTION}`}
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Auctions
              </Link>
              <Link
                prefetch
                href={`${ROUTE_CONSTANTS.CONTACT}`}
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section className="pt-20 bg-white">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Auction Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide professional, ground-level support to ensure your property auction experience is smooth, secure, and successful.
            </p>
          </div>

          <div className="space-y-16">
            {/* Due Diligence Service */}
            <section id="due-diligence" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-odd-color section-class py-12">
              <div>
                <div className="bg-indigo-50 rounded-xl p-4 w-16 h-16 mb-6">
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Due Diligence</h1>
                <p className="text-lg  mb-6">
                  Our comprehensive property verification service ensures you have complete information before making any bidding decisions.
                </p>
                <ul className="space-y-3 text-sm-xs">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Complete title verification and legal clearance checks</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Encumbrance certificate analysis and property history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Professional property valuation and market analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Legal compliance verification and documentation review</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                <div className="mb-4">Verification Accuracy</div>
                <p className="text-sm-xs">
                  Our expert team ensures complete accuracy in all property verifications
                </p>
              </div>
            </section>

            {/* Loan Approval Service */}
            <section id="loan-approval" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-even-color section-class py-12">
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl p-8 text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">48hrs</div>
                  <div className="mb-4">Average Approval Time</div>
                  <p className="text-sm-xs">
                    Fast-track loan processing with our banking partners
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-indigo-50 rounded-xl p-4 w-16 h-16 mb-6">
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Loan Approval Assistance</h1>
                <p className="text-lg  mb-6">
                  Get expert help with loan applications and connect with trusted financial institutions for quick approvals.
                </p>
                <ul className="space-y-3 text-sm-xs">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Complete loan application assistance and documentation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Direct connections with leading banks and NBFCs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Competitive interest rates and flexible terms</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Fast-track processing for pre-approved customers</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Property Visit Service */}
            <section id="property-visit" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-odd-color section-class py-12">
              <div>
                <div className="bg-indigo-50 rounded-xl p-4 w-16 h-16 mb-6">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Guided Property Visits</h1>
                <p className="text-lg  mb-6">
                  Our local experts accompany you for property inspections, providing valuable insights and professional assessment.
                </p>
                <ul className="space-y-3 text-sm-xs">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Professional property condition assessment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Location analysis and neighborhood insights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Identification of potential issues and opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Market comparison and investment potential analysis</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="mb-4">Properties Inspected</div>
                <p className="text-sm-xs">
                  Extensive experience in property assessment across all categories
                </p>
              </div>
            </section>

            {/* Auction Process Service */}
            <section id="auction-process" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-even-color section-class py-12">
              <div className="order-2 lg:order-1">
                <div className=" rounded-2xl p-8 text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                  <div className="mb-4">Support Available</div>
                  <p className="text-sm-xs">
                    Round-the-clock assistance throughout the auction process
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-indigo-50 rounded-xl p-4 w-16 h-16 mb-6">
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Auction Support</h1>
                <p className="text-lg  mb-6">
                  From registration to final documentation, we guide you through every step of the online auction process.
                </p>
                <ul className="space-y-3 text-sm-xs">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Complete auction registration and EMD assistance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Strategic bidding guidance and market insights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Real-time auction monitoring and support</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Post-auction documentation and legal formalities</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>


    </div>
  );
};