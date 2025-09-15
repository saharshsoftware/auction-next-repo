import React from 'react';
import { 
  Search, 
  Building, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  FileText,
  Heart,
  Smartphone,
  Globe,
  Award,
  Target,
  Zap,
  Monitor,
  Database,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { ROUTE_CONSTANTS } from '@/shared/Routes';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-brand-color text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              About Us
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl mb-8 leading-relaxed text-indigo-100">
                At <span className="font-bold text-white">e-auctiondekho</span>, we combine cutting-edge technology with comprehensive ground-level support to transform how you explore auctioned properties from banks. 
                Our tech-first approach streamlines the entire process from property identification to auction participation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ROUTE_CONSTANTS.AUCTION}
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Auctions
              </Link>
              <Link
                href={ROUTE_CONSTANTS.CONTACT}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech-First Approach Section */}
      <section className="pt-20 bg-odd-color">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tech-First Approach with Human Touch
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              We leverage advanced technology to streamline the auction process while providing comprehensive ground-level support throughout your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 bg-odd-color section-class py-12">
            <div>
              <div className="bg-blue-50 rounded-xl p-4 w-16 h-16 mb-6">
                <Monitor className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technology-Driven Platform</h3>
              <p className="text-lg leading-relaxed mb-6">
                Our advanced platform aggregates auction data from multiple banks, uses smart algorithms for property matching,
                and provides real-time updates to ensure you never miss an opportunity.
              </p>
              <div className="space-y-3 text-sm-xs">
                <div className="flex items-center ">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Smart property recommendations</span>
                </div>
                <div className="flex items-center ">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Real-time auction alerts and notifications</span>
                </div>
                <div className="flex items-center ">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Advanced search and filtering capabilities</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">Trusted Accuracy</div>
              <p className="text-sm">
                Our systems automatically process and verify auction data from almost all banks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-even-color section-class py-12">
            <div className="order-2 md:order-1">
              <div className="rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">Expert</div>
                <p className="text-sm-xs">
                  Our expert team provides comprehensive assistance throughout your auction journey
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className=" rounded-xl p-4 w-16 h-16 mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">End-to-End Ground Support</h3>
              <p className="text-lg leading-relaxed mb-6">
                While technology powers our platform, our experienced team provides personalized support from property identification 
                to successful auction participation, ensuring you have professional guidance throughout the process.
              </p>
              <div className="space-y-3 text-sm-xs">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Property verification and due diligence</span>
                </div>
                <div className="flex items-center ">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>On-ground property inspections</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span>Auction participation assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problems with Bank Websites
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              We identified the key challenges that make property hunting frustrating and time-consuming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-odd-color section-class ">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="bg-blue-50 rounded-xl p-4 w-16 h-16 mb-6">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Outdated Interfaces</h3>
              <p className="text-sm-xs">
                Many bank websites are cluttered and difficult to navigate, making it hard to find what you&apos;re looking for.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="bg-blue-50 rounded-xl p-4 w-16 h-16 mb-6">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Limited Functionality</h3>
              <p className="text-sm-xs">
                No advanced features like saving searches, wishlists, or email alerts to help you stay updated.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="bg-blue-50 rounded-xl p-4 w-16 h-16 mb-6">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multiple Platforms</h3>
              <p className="text-sm-xs">
                You have to browse across different websites just to gather information, making the process time-consuming and inefficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="">
        <div className="">
          <div className="text-center bg-even-color section-class pt-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
              Why e-auctiondekho is Different
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              We bring all bank auctions under one roof with advanced technology and comprehensive support
            </p>
          </div>

          <div className="space-y-4">
            {/* Unified Platform */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-even-color section-class py-12">
              <div>
                <div className=" rounded-xl p-4 w-16 h-16 mb-6">
                  <Database className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Unified Platform</h3>
                <p className="text-lg leading-relaxed mb-6">
                  We bring all bank auctions under one roof, saving you time and effort. No more jumping between different bank websites. 
                  Our technology aggregates data from multiple sources in real-time.
                </p>
                <div className="space-y-2 text-sm-xs">
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>All major banks in one platform</span>
                  </div>
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>Real-time data synchronization</span>
                  </div>
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>Comprehensive property database</span>
                  </div>
                </div>
              </div>
              <div className=" rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">Wide Coverage</div>
                <p className="text-sm-xs">
                  Access properties from almost all banks in one unified platform
                </p>
              </div>
            </div>

            {/* User-Friendly Search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-odd-color section-class py-12">
              <div className="order-2 lg:order-1">
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">Smart</div>
                  <p className="text-sm-xs">
                    Advanced algorithms help you find the perfect property match
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-blue-50 rounded-xl p-4 w-16 h-16 mb-6">
                  <Cpu className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Search & Filtering</h3>
                <p className="text-lg leading-relaxed mb-6">
                  Our smart search engine helps you filter properties by location, bank, category, and price range.
                  Get personalized recommendations based on your preferences and search history.
                </p>
                <div className="space-y-2 text-sm-xs">
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>Advanced search filters</span>
                  </div>
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>Location-based recommendations</span>
                  </div>
                  <div className="flex items-center ">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                    <span>Personalized property matching</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-even-color section-class py-12">
              <div>
                <div className=" rounded-xl p-4 w-16 h-16 mb-6">
                  <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Features</h3>
                <p className="text-lg leading-relaxed mb-6">
                  Our platform offers comprehensive features that traditional bank websites lack, 
                  combined with expert support throughout your auction journey.
                </p>
                <div className="space-y-4 text-sm-xs">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2">Create Wishlists</h4>
                    <p className="">Save your favorite properties and track their auction status.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2">Email Alerts</h4>
                    <p className="">Get notified when new properties matching your preferences are listed.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2">Comprehensive Listings</h4>
                    <p className="">Whether it&apos;s residential, commercial, land, or vehicles—find it all on eAuctionDekho.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">Comprehensive Listings</div>
                <p className="text-sm-xs">
                  Comprehensive database covering almost all auction properties across all categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Process Section */}
      <section className="bg-odd-color section-class py-12">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Streamlined Auction Process
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              From property identification to auction participation, we&apos;ve simplified every step of the journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-4 shadow-sm">
                <Search className="h-8 w-8 text-indigo-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Discover</h3>
              <p className="text-gray-600 text-sm-xs">Use our smart search to find properties that match your criteria</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-4 shadow-sm">
                <Shield className="h-8 w-8 text-indigo-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Verify</h3>
              <p className="text-gray-600 text-sm-xs">Our experts conduct thorough due diligence and property verification</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-4 shadow-sm">
                <Users className="h-8 w-8 text-indigo-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Support</h3>
              <p className="text-gray-600 text-sm-xs">Get personalized assistance with documentation and loan approvals</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-4 shadow-sm">
                <Award className="h-8 w-8 text-indigo-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Participate</h3>
              <p className="text-gray-600 text-sm-xs">Confidently participate in auctions with our expert guidance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};