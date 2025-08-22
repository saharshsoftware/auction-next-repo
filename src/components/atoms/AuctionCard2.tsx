/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {
  formatISTDateTime,
  getSharedAuctionUrl,
} from "../../shared/Utilies";
import { IAuction } from "@/types";
import Link from "next/link";
import { Eye, Share } from "lucide-react";
import { getPropertyImages } from "@/utilies/imageUtils";
import { WhatsappShareWithIcon } from "./SocialIcons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "./ActionButton";
import FullScreenImageModal from "../ modals/FullScreenImageModal";
import useModal from "@/hooks/useModal";

interface PropertyCardProps {
  property: IAuction;
  isAdmin?: boolean;
  className?: string;
  showRemoveButton?: boolean;
  propertyId?: string;
  handleRemove?: (data: any) => void;
}

const auctionLabelClass = () => "text-sm-xs text-gray-400 font-bold";

export const AuctionCard2: React.FC<PropertyCardProps> = (props) => {
  const {
    property,
    isAdmin = false,
    className = '',
    showRemoveButton = false,
    propertyId = '',
    handleRemove = () => { },
  } = props;
  const {
    showModal: showImageModal,
    openModal: openImageModal,
    hideModal: hideImageModal,
  } = useModal();

  const sharedUrl = getSharedAuctionUrl(property);
  const isViewNoticeVisible = property?.noticeLink && isAdmin;
  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0' || price === 'null') return 'Not specified';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) return 'Not specified';

    let formattedPrice: string;

    if (numPrice >= 10000000) {
      // If price is greater than or equal to 1 crore (10,000,000)
      formattedPrice = (numPrice / 10000000).toFixed(2) + ' Cr';
    } else if (numPrice >= 100000) {
      // If price is greater than or equal to 1 lakh (100,000)
      formattedPrice = (numPrice / 100000).toFixed(2) + ' Lakh';
    } else {
      formattedPrice = numPrice.toLocaleString();
    }
    return `₹ ${formattedPrice}`;
  };


  const propertyImages = getPropertyImages(property);
  const hasRealImages = propertyImages.length > 0 && !propertyImages[0].includes('no-image-placeholder.png');
  const imageUrl = hasRealImages ? propertyImages[0] : null;

  return (
    <>
      {openImageModal ? (
        <FullScreenImageModal
          openModal={openImageModal}
          hideModal={hideImageModal}
          imageUrl={imageUrl || ''}
        />
      ) : null}
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200`}>
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Image Section - Mobile (only show if real images exist) */}
          {hasRealImages && (
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={imageUrl!}
                alt={property?.title || 'Property'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onClick={showImageModal}
              />

              {/* Property Type Badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetType || 'Property'}
                </span>
              </div>

              {/* Image Count Indicator */}
              {property?.images?.length > 1 && (
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {property?.images?.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Section - Mobile */}
          <div className="p-4">
            {/* Property Type badge when no image - Mobile */}
            {!hasRealImages && (
              <div className="flex justify-start items-center mb-3">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetType || 'Property'}
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
              <div className="text-sm-xs text-gray-600">
                <span className="font-medium">Seller - </span>
                <span>{property?.bankName || 'Not specified'}</span>
              </div>
            </div>

            {/* Date and Asset Info - Mobile Stack */}
            <div className="space-y-2 mb-4">
              <div className="text-sm-xs font-semibold text-gray-900">
                {property?.auctionStartTime && (
                  <span>{formatISTDateTime(property?.auctionStartTime?.toString())}</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm-xs text-gray-600">
                <span className="font-medium">{property?.assetCategory || 'Property'}</span>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="font-medium">{property?.assetType || 'Asset'}</span>
              </div>
            </div>

            {/* View Auction Button - Full Width on Mobile */}
            <div className="space-y-2">
              <Link
                href={`/auctions/${property?.slug}`}
                className="block w-full text-center px-4 py-2.5 bg-brand-color text-white rounded-lg hover:bg-blue-700 transition-colors text-sm-xs font-semibold"
              >
                View Auction
              </Link>

              {/* Notice Link - Mobile */}
              {isViewNoticeVisible && (
                <a
                  href={property?.noticeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm-xs font-medium"
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
                alt={property?.title || 'Property'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={showImageModal}
              />

              {/* Property Type Badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetType || 'Property'}
                </span>
              </div>

              {/* Image Count Indicator */}
              {property?.images?.length > 1 && (
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {property?.images?.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Section - Desktop */}
          <div className="flex-1 p-6">
            {/* Property Type badge when no image - Desktop */}
            {!hasRealImages && (
              <div className="flex justify-start items-center mb-4">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetType || 'Property'}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 mr-4">
                {property?.title || 'Property Title Not Available'}
              </h3>

              {/* Share Button */}
              <button className="flex items-center px-3 py-1.5 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm-xs font-medium">
                {WhatsappShareWithIcon({ url: sharedUrl })}
              </button>
            </div>

            {/* Reserve Price */}
            <div className="mb-4">
              <div className="text-sm-xs text-gray-600 mb-1">Reserve price</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(property?.reservePrice?.toString())}
              </div>
            </div>

            {/* Seller and Branch Info */}
            <div className="mb-4 space-y-1">
              <div className="text-sm-xs text-gray-600">
                <span className="font-medium">Seller - </span>
                <span>{property?.bankName || 'Not specified'}</span>
              </div>
            </div>

            {/* Bottom Row - Date, Property Type, and Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm-xs text-gray-900">
                {/* Auction Date and Time */}
                <div className="flex items-center">
                  <span className="font-semibold">
                    {property?.auctionStartTime && (
                      <span>{formatISTDateTime(property?.auctionStartTime?.toString())}</span>
                    )}
                  </span>
                </div>

                {/* Separator */}
                <div className="w-px h-4 bg-gray-300"></div>

                {/* Asset Category */}
                <div className="font-medium">
                  {property?.assetCategory || 'Property'}
                </div>

                {/* Separator */}
                <div className="w-px h-4 bg-gray-300"></div>

                {/* Property Type */}
                <div className="font-medium">
                  {property?.assetType || 'Asset'}
                </div>
              </div>

              {/* View Auction Button */}
              <div className="flex items-center space-x-3">
                <Link
                  href={`/auctions/${property?.slug}`}
                  prefetch={false}
                  className="inline-flex items-center px-6 py-2.5 bg-brand-color text-white rounded-lg hover:bg-blue-700 transition-colors text-sm-xs font-semibold"
                >
                  View Auction
                </Link>

                {/* Notice Link - Desktop */}
                {isViewNoticeVisible && (
                  <a
                    href={property?.noticeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm-xs font-medium"
                  >
                    View Notice
                  </a>
                )}

                {showRemoveButton ? (
                  <ActionButton
                    text="Remove"
                    icon={<FontAwesomeIcon icon={faX} />}
                    customClass="w-fit"
                    onclick={() => handleRemove(propertyId)}
                    isDeleteButton={true}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
