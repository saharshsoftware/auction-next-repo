import React from 'react';
import { Eye, Share } from 'lucide-react';
import { IAuction } from '@/types';
import { getPropertyImages } from '@/utilies/imageUtils';
import Link from 'next/link';

interface PropertyCardProps {
  property: IAuction;
  isAdmin?: boolean;
  className?: string;
}

export const AuctionCard2: React.FC<PropertyCardProps> = ({ property, isAdmin = false, className = '' }) => {
  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0' || price === 'null') return 'Not specified';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) return 'Not specified';
    
    // Format in Lakhs for Indian currency
    if (numPrice >= 100000) {
      const lakhs = numPrice / 100000;
      return `₹ ${lakhs.toFixed(2)} Lakh`;
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '';
    }
  };

  const getStatusFromDate = (auctionDate: string | null | undefined) => {
    if (!auctionDate) return 'unknown';
    const now = new Date();
    const auction = new Date(auctionDate);
    
    if (auction > now) return 'upcoming';
    
    // Check if auction ended (assuming 6 hours duration)
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

  const status = getStatusFromDate(property?.auctionDate?.toString());
  const propertyImages = getPropertyImages(property);
  const hasRealImages = propertyImages.length > 0 && !propertyImages[0].includes('no-image-placeholder.png');
  const imageUrl = hasRealImages ? propertyImages[0] : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 ${className}`}>
      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Image Section - Mobile (only show if real images exist) */}
        {hasRealImages && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={imageUrl!}
              alt={property.title || 'Property'}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'live' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
              </span>
            </div>
            
            {/* Asset Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                {property?.asset_type || 'Property'}
              </span>
            </div>

            {/* Image Count Indicator */}
            {propertyImages?.length > 1 && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {propertyImages?.length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Section - Mobile */}
        <div className="p-4">
          {/* Status and Asset Type badges when no image - Mobile */}
          {!hasRealImages && (
            <div className="flex justify-between items-center mb-3">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                {property?.asset_type || 'Property'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'live' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
              </span>
            </div>
          )}

          {/* Title and Share Button */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1 mr-3">
              {property?.title || 'Property Title Not Available'}
            </h3>
            <button className="flex items-center px-2 py-1 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-xs font-medium flex-shrink-0">
              <Share className="h-3 w-3 mr-1" />
              Share
            </button>
          </div>

          {/* Reserve Price */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Reserve price</div>
            <div className="text-xl font-bold text-green-600">
              {formatPrice(property?.reservePrice?.toString())}
            </div>
          </div>

          {/* Seller and Branch Info */}
          <div className="mb-3 space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Seller - </span>
              <span>{property?.bankName || 'Not specified'}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Branch Name - </span>
              <span>{property?.branchName || 'Not specified'}</span>
            </div>
          </div>

          {/* Date and Asset Info - Mobile Stack */}
          <div className="space-y-2 mb-4">
            <div className="text-sm font-semibold text-gray-900">
              {formatDate(property?.auctionDate?.toString())}
              {property?.auctionStartTime && (
                <span>, {formatTime(property?.auctionDate?.toString())}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{property?.assetCategory || 'Property'}</span>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="font-medium">{property?.assetType || 'Asset'}</span>
            </div>
          </div>

          {/* View Auction Button - Full Width on Mobile */}
          <div className="space-y-2">
            <Link
              href={`/auctions/${property?.slug || ''}`}
              className="block w-full text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              View Auction
            </Link>
            
            {/* Notice Link - Mobile */}
            {property.noticeLink && (
              <a
                href={property.noticeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                View Notice
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Image Section - Desktop (only show if real images exist) */}
        {hasRealImages && (
          <div className="relative w-80 h-64 flex-shrink-0 overflow-hidden">
            <img
              src={imageUrl!}
              alt={property.title || 'Property'}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'live' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            
            {/* Asset Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                {property.assetType || 'Property'}
              </span>
            </div>

            {/* Image Count Indicator */}
            {propertyImages.length > 1 && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {propertyImages.length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Section - Desktop */}
        <div className="flex-1 p-6">
          {/* Status and Asset Type badges when no image - Desktop */}
          {!hasRealImages && (
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                {property.assetType || 'Property'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'live' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 mr-4">
              {property.title || 'Property Title Not Available'}
            </h3>
            
            {/* Share Button */}
            <button className="flex items-center px-3 py-1.5 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
              <Share className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>

          {/* Reserve Price */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Reserve price</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(property.reservePrice?.toString())}
            </div>
          </div>

          {/* Seller and Branch Info */}
          <div className="mb-4 space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Seller - </span>
              <span>{property.bankName || 'Not specified'}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Branch Name - </span>
              <span>{property.branchName || 'Not specified'}</span>
            </div>
          </div>

          {/* Bottom Row - Date, Asset Type, and Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-900">
              {/* Auction Date and Time */}
              <div className="flex items-center text-sm">
                <span className="font-semibold">
                  {formatDate(property.auctionDate?.toString())}
                  {property.auctionStartTime && (
                    <span>, {formatTime(property.auctionDate?.toString())}</span>
                  )}
                </span>
              </div>
              
              {/* Separator */}
              <div className="w-px h-4 bg-gray-300"></div>
              
              {/* Asset Category */}
              <div className="font-medium text-sm">
                {property.assetCategory || 'Property'}
              </div>
              
              {/* Separator */}
              <div className="w-px h-4 bg-gray-300"></div>
              
              {/* Asset Type */}
              <div className="font-medium text-sm">
                {property.assetType || 'Asset'}
              </div>
            </div>

            {/* View Auction Button */}
            <div className="flex items-center space-x-3">
              <Link
                href={`/auctions/${property.slug || ''}`}
                className="inline-flex items-center px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                View Auction
              </Link>
              
              {/* Notice Link - Desktop */}
              {property.noticeLink && (
                <a
                  href={property.noticeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  View Notice
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};