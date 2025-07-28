'use client'
import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  Building,
  Phone,
  ArrowLeft,
  Home,
  Download,
  CreditCard,
  Info,
  Banknote} from 'lucide-react';
import { IAuction } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PropertyMap } from '@/components/ui/PropertyMap';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { getPropertyImages } from '@/utilies/imageUtils';
import Link from 'next/link';

// add props type
interface AuctionDetailPageProps {
  auctionDetail: IAuction,
  slug: string,
  isInterested: boolean
}

export const AuctionDetailPage: React.FC<AuctionDetailPageProps> = ({ auctionDetail, slug, isInterested }) => {
  const property = auctionDetail;
  const id = property?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin] = useState(true); // Default to true as requested

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={() => { }} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
            <Link
              href="/auctions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0' || price === 'null') return 'Not specified';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) return 'Not specified';

    let formattedPrice: string;

    if (numPrice >= 10000000) {
      // If price is greater than or equal to 1 crore (10,000,000)
      formattedPrice = (numPrice / 10000000).toFixed(2).toLocaleString() + ' Cr';
    } else if (numPrice >= 100000) {
      // If price is greater than or equal to 1 lakh (100,000)
      formattedPrice = (numPrice / 100000).toFixed(2).toLocaleString() + ' Lakh';
    } else {
      formattedPrice = numPrice.toLocaleString();
    }
    return `₹ ${formattedPrice}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }).replace(/ /g, '-');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateForDisplay = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }).replace(/ /g, '-');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateAndTimeForDisplay = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }).replace(/ /g, '-');

      const formattedTime = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusFromDate = (auctionDate: string | null | undefined) => {
    if (!auctionDate) return 'unknown';
    const now = new Date();
    const auction = new Date(auctionDate);

    if (auction > now) return 'upcoming';

    const auctionEnd = new Date(auction.getTime() + 6 * 60 * 60 * 1000);
    if (now > auctionEnd) return 'ended';

    return 'live';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Method to get auction time display
  const getAuctionTimeDisplay = () => {
    if (!property.auctionDate) return 'Not specified';

    const auctionDate = new Date(property.auctionDate);
    const startTime = property.auctionStartTime || '10:00 AM';

    // Calculate end time (assuming 6 hours duration if no end time specified)
    let endTime = 'TBD';
    if (property.auctionEndDate) {
      const endDate = new Date(property.auctionEndDate);
      endTime = endDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // Calculate end time by adding 6 hours to start time
      const [time, period] = startTime.toString().split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let endHours = hours + 6;
      let endPeriod = period;

      if (endHours >= 12 && period === 'AM') {
        endPeriod = 'PM';
        if (endHours > 12) endHours -= 12;
      } else if (endHours > 12 && period === 'PM') {
        endHours -= 12;
        endPeriod = 'AM';
      }

      endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${endPeriod}`;
    }

    return `${startTime} To ${endTime}`;
  };

  // About Property Section Component
  const renderAboutPropertySection = () => {
    // Check if we have any meaningful property data to display
    const hasDescription = property.description && property.description.trim();
    const hasResidentialDetail = property.residential_detail && property.residential_detail.trim();
    const hasCommercialDetail = property.commercial_detail && property.commercial_detail.trim();
    const hasIndustryDetail = property.industry_detail && property.industry_detail.trim();
    const hasAgricultureDetail = property.agriculture_detail && property.agriculture_detail.trim();
    const hasPropertyAddress = property.property_address && property.property_address.trim();
    const hasPincode = property.pincode && property.pincode.trim();

    // If no meaningful data exists, return null
    if (!hasDescription && !hasResidentialDetail && !hasCommercialDetail &&
      !hasIndustryDetail && !hasAgricultureDetail && !hasPropertyAddress && !hasPincode) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SectionHeader title="About Property" />
        <div className="text-sm text-gray-700 leading-relaxed">
          {hasDescription ? (
            <p className="mb-3">{property.description}</p>
          ) : (
            <>
              {hasResidentialDetail && (
                <p className="mb-3">
                  <strong>Residential Details:</strong> {property.residential_detail}
                </p>
              )}
              {hasCommercialDetail && (
                <p className="mb-3">
                  <strong>Commercial Details:</strong> {property.commercial_detail}
                </p>
              )}
              {hasIndustryDetail && (
                <p className="mb-3">
                  <strong>Industrial Details:</strong> {property.industry_detail}
                </p>
              )}
              {hasAgricultureDetail && (
                <p className="mb-3">
                  <strong>Agricultural Details:</strong> {property.agriculture_detail}
                </p>
              )}
              {hasPropertyAddress && (
                <p className="mb-3">
                  <strong>Address:</strong> {property.property_address}
                  {hasPincode && `, PIN: ${property.pincode}`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Helper component for section headers
  const SectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = '' }) => (
    <div className={`border-b border-gray-200 pb-3 mb-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );

  // Helper component for data rows in a clean table format
  const DataTable: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`space-y-0 ${className}`}>
      {children}
    </div>
  );

  const DataRow: React.FC<{
    label: string;
    value: string | React.ReactNode;
    className?: string;
  }> = ({ label, value, className = '' }) => (
    <div className={`grid grid-cols-2 py-3 border-b border-gray-100 last:border-b-0 ${className}`}>
      <div className="text-sm font-medium text-gray-600">
        {label}
      </div>
      <div className="text-sm text-gray-900 font-medium">
        {value}
      </div>
    </div>
  );

  const status = getStatusFromDate(property.auctionDate?.toString());
  const images = getPropertyImages(property);
  const hasRealImages = images.length > 0 && !images[0].includes('no-image-placeholder.png');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Link
          href="/auctions"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Link>

        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {property.title || 'Property Title Not Available'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{property.city && property.state ? `${property.city}, ${property.state}` : 'Location not specified'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{property.assetType || 'Asset type not specified'}</span>
                </div>
                {property.area && (
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{property.area}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                {status === 'unknown' ? 'Not specified' : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>

          {/* Key Auction Details - Quick Overview */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Reserved Price */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Reserved Price</span>
                  <Info className="h-3 w-3 text-gray-500" />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatPrice(property.reservePrice?.toString())}
                </div>
              </div>

              {/* Service Provider */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Service Provider</span>
                  <Building className="h-3 w-3 text-gray-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {property.serviceProvider || 'Not specified'}
                </div>
              </div>

              {/* Auction Date */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Auction Start Date</span>
                  <Calendar className="h-3 w-3 text-gray-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatDateForDisplay(property.auctionDate?.toString())}
                </div>
              </div>

              {/* Auction End Date */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Auction End Date</span>
                  <Calendar className="h-3 w-3 text-gray-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {property.auctionEndDate ? formatDateForDisplay(property.auctionEndDate?.toString()) : 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Carousel - Only show if we have real property images */}
        {hasRealImages && (
          <div className="mb-6">
            <ImageCarousel
              images={images}
              title={property.title || 'Property Images'}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="gap-6">
          {/* Left Column */}
          <div className="space-y-6">

            {/* About Property Section */}
            {renderAboutPropertySection()}

            {/* Important Dates Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SectionHeader title="Important Dates" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Auction Start Date & Time */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Auction Start Date & Time
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatDateForDisplay(property.auctionDate?.toString())}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-semibold">
                    {property.auctionStartTime ?
                      new Date(property.auctionStartTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) :
                      'Not specified'
                    }
                  </div>
                </div>

                {/* Auction End Date & Time */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Auction End Date & Time
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.auctionEndDate ? formatDateForDisplay(property.auctionEndDate?.toString()) : 'Not specified'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-semibold">
                    {property.auctionEndDate ?
                      new Date(property.auctionEndDate).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) :
                      'Not specified'
                    }
                  </div>
                </div>

                {/* Press Release Date */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Press Release Date
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatDateForDisplay(property.createdAt?.toString())}
                  </div>
                </div>

                {/* Property Inspection Date and Time */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Property Inspection Date and Time
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                        {formatDateAndTimeForDisplay(property.inspectionDateFrom?.toString())}
                  </div>
                  {property.inspectionDateTo && (
                    <div className="text-sm text-gray-600 mt-1 font-medium">
                      to {formatDateAndTimeForDisplay(property.inspectionDateTo?.toString())}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Price Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SectionHeader title="Price Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reserve Price */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Reserve Price
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(property?.reservePrice?.toString())}
                  </div>
                </div>

                {/* EMD Amount */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" />
                    EMD Amount
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(property?.emd?.toString() || '0')}
                  </div>
                </div>

                {/* Increment Price */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                    <Banknote className="h-3 w-3 mr-1" />
                    Increment Price
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(property?.incrementPrice?.toString() || '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SectionHeader title="Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Branch */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Branch
                  </div>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {property.branchName || '-'}
                  </div>
                </div>


                {/* Inspection Officer */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Inspection Officer
                  </div>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {property.inspectionOfficerName || '-'}
                  </div>
                </div>

                {/* Contact Number */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact Number
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {property.contactNo ? (
                      <a
                        href={`tel:${property.contactNo}`}
                        className="hover:text-gray-700 transition-colors"
                      >
                        {property.contactNo}
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>

                {/* Bank Property ID */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Bank Property ID
                  </div>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {property.bankPropertyId || '-'}
                  </div>
                </div>

                {/* Possession Type */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Possession Type
                  </div>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {property.propertyPossessionType || '-'}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Property Map - Full width */}
        {(property.lat && property.lng) && (
          <div className="mt-6">
            <PropertyMap
              lat={property.lat}
              lng={property.lng}
              title="Property Location"
              address={property.propertyAddress || undefined}
            />
          </div>
        )}

        {/* Action Button - Download Notice */}
        {property.noticeLink && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <a
                href={property.noticeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Auction Notice
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};